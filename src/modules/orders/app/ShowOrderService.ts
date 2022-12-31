import AppError from '@shared/errors/AppError';
import { IOrder } from '../domain/models/IOrder';
import { IShowOrder } from '../domain/models/IShowOrder';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
class ShowOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
  ) {}
  public async execute({ id }: IShowOrder): Promise<IOrder> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new AppError('Order not found.', 404);
    }

    return order;
  }
}

export default ShowOrderService;
