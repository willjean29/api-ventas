import { Request, Response, NextFunction } from 'express';
import { CreateOrderService, ShowOrderService, ListOrderService } from '../../../app';
import { container } from 'tsyringe';

class OrdersController {
  public async index(request: Request, response: Response) {
    const listOrderService = container.resolve(ListOrderService);

    const order = await listOrderService.execute();
    return response.json(order);
  }
  public async show(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const showOrderService = container.resolve(ShowOrderService);

    try {
      const order = await showOrderService.execute({ id });
      return response.json(order);
    } catch (error) {
      return next(error);
    }
  }

  public async create(request: Request, response: Response, next: NextFunction) {
    const { customer_id, products } = request.body;
    const createOrderService = container.resolve(CreateOrderService);
    try {
      const order = await createOrderService.execute({ customer_id, products });
      return response.json(order);
    } catch (error) {
      return next(error);
    }
  }
}

export default OrdersController;
