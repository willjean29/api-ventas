import AppError from '@shared/errors/AppError';
import { IDeleteProduct } from '../domain/models/IDeleteProduct';
import { IProduct } from '../domain/models/IProduct';
import RedisCache from '@shared/cache/RedisCache';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ id }: IDeleteProduct): Promise<IProduct> {
    const redisCache = RedisCache.getInstance();
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await this.productsRepository.remove(product);
    await redisCache.invalidate('api-vendas-PRODUCT_LIST');
    return product;
  }
}

export default DeleteProductService;
