import RedisCache from '@shared/cache/RedisCache';
import { IOrder } from '../domain/models/IOrder';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
class ListOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}
  public async execute(): Promise<IOrder[]> {
    const redisCache = RedisCache.getInstance();

    let orders = await redisCache.recover<IOrder[]>('api-vendas-ORDER_LIST');
    if (!orders) {
      orders = await this.ordersRepository.findAll();
      await redisCache.save('api-vendas-ORDER_LIST', orders);
    }
    return orders;
  }
}

export default ListOrderService;
