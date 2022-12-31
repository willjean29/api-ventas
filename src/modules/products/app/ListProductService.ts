import RedisCache from '@shared/cache/RedisCache';
import { IProduct } from '../domain/models/IProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
class ListProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute(): Promise<IProduct[]> {
    const redisCache = RedisCache.getInstance();
    let products = await redisCache.recover<IProduct[]>('api-vendas-PRODUCT_LIST');

    if (!products) {
      products = await this.productsRepository.findAll();
      await redisCache.save('api-ventas-PRODUCT_LIST', products);
    }

    return products;
  }
}

export default ListProductService;
