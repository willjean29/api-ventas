import { Repository, EntityManager, In } from 'typeorm';
import { AppDataSource } from '@shared/infra/typeorm';
import Product from '../entities/Product';
import { IProductsRepository } from '@modules/products/domain/repositories/IProductsRepository';
import { IFindProducts } from '@modules/products/domain/models/IFindProducts';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';

class ProductsRepository implements IProductsRepository {
  private repository: Repository<Product>;
  constructor() {
    this.repository = new Repository(Product, new EntityManager(AppDataSource));
  }

  public async findAll(): Promise<Product[]> {
    const products = await this.repository.find();
    return products;
  }

  public async findById(id: string): Promise<Product | null> {
    const product = await this.repository.findOne({
      where: {
        id,
      },
    });
    return product;
  }

  public async findByName(name: string): Promise<Product | null> {
    const product = this.repository.findOne({
      where: {
        name,
      },
    });
    return product;
  }

  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);

    const existsProducts = await this.repository.find({
      where: {
        id: In(productIds),
      },
    });

    return existsProducts;
  }

  public async create(data: ICreateProduct): Promise<Product> {
    const product = this.repository.create(data);
    await this.repository.save(product);
    return product;
  }

  public async save(product: Product): Promise<Product> {
    await this.repository.save(product);
    return product;
  }

  public async remove(product: Product): Promise<void> {
    await this.repository.remove(product);
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    await this.repository.save(products);
  }
}

export default ProductsRepository;
