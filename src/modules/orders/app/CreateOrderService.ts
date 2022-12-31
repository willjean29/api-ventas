import AppError from '@shared/errors/AppError';
import { IOrder } from '../domain/models/IOrder';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { injectable, inject } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ customer_id, products }: IRequestCreateOrder): Promise<IOrder> {
    const customerExists = await this.customersRepository.findById(customer_id);
    if (!customerExists) {
      throw new AppError('Could not find any customer with the diven id', 404);
    }
    const existsProducts = await this.productsRepository.findAllByIds(products);

    if (!existsProducts.length) {
      throw new AppError('Could not find any products with the diven ids', 404);
    }

    const existsProductsIds = existsProducts.map(product => product.id);

    const checkInexistentProducts = products.filter(product => !existsProductsIds.includes(product.id));

    if (checkInexistentProducts.length) {
      throw new AppError(`Could not find products ${checkInexistentProducts[0].id}`);
    }

    const quantityAvailable = products.filter(
      product => existsProducts.filter(p => p.id === product.id)[0].quantity < product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRepository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const updateProductsQuantity = order.order_products.map(product => ({
      id: product.product_id,
      quantity: existsProducts.filter(p => p.id === product.product_id)[0].quantity - product.quantity,
    }));

    const redisCache = RedisCache.getInstance();
    await this.productsRepository.updateStock(updateProductsQuantity);
    await redisCache.invalidate('api-vendas-ORDER_LIST');
    return order;
  }
}

export default CreateOrderService;
