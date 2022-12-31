import { Repository, EntityManager } from 'typeorm';
import { AppDataSource } from '@shared/infra/typeorm';
import Order from '../entities/Order';
import { IOrdersRepository } from '@modules/orders/domain/repositories/IOrdersRepository';
import { ICreateOrder } from '../../../domain/models/ICreateOrder';

class OrdersRepository implements IOrdersRepository {
  private repository: Repository<Order>;
  constructor() {
    this.repository = new Repository(Order, new EntityManager(AppDataSource));
  }

  public async findById(id: string): Promise<Order | null> {
    const order = this.repository.findOne({
      where: {
        id,
      },
      relations: ['order_products', 'customer'],
    });
    return order;
  }

  public async create(data: ICreateOrder): Promise<Order> {
    const order = this.repository.create({
      customer: data.customer,
      order_products: data.products,
    });
    await this.repository.save(order);
    return order;
  }

  public async findAll(): Promise<Order[]> {
    const orders = this.repository.find({
      relations: ['order_products', 'customer'],
    });
    return orders;
  }
}

export default OrdersRepository;
