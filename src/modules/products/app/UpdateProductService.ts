import AppError from '@shared/errors/AppError';
import { IUpdateProduct } from '../domain/models/IUpdateProduct';
import { IProduct } from '../domain/models/IProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { injectable, inject } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ id, name, price, quantity }: IUpdateProduct): Promise<IProduct> {
    const product = await this.productsRepository.findById(id);
    const redisCache = RedisCache.getInstance();
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const productExists = await this.productsRepository.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError('There is already one product with this name');
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
    return product;
  }
}

export default UpdateProductService;
