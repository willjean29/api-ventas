import AppError from '@shared/errors/AppError';
import { IShowProduct } from '../domain/models/IShowProduct';
import { IProduct } from '../domain/models/IProduct';
import { IProductsRepository } from '../domain/repositories/IProductsRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
class ShowProductService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}
  public async execute({ id }: IShowProduct): Promise<IProduct> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }
}

export default ShowProductService;
