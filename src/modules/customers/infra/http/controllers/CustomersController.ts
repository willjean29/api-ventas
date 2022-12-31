import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import {
  ShowCustomerService,
  CreateCustomerService,
  DeleteCustomerService,
  ListCustomerService,
  UpdateCustomerService,
} from '../../../app';

class CustomersController {
  public async index(request: Request, response: Response, next: NextFunction) {
    const listCustomerService = container.resolve(ListCustomerService);
    try {
      const customers = await listCustomerService.execute();

      return response.json(customers);
    } catch (error) {
      return next(error);
    }
  }

  public async show(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const showCustomerService = container.resolve(ShowCustomerService);

    try {
      const customer = await showCustomerService.execute({ id });
      return response.json(customer);
    } catch (error) {
      return next(error);
    }
  }

  public async create(request: Request, response: Response, next: NextFunction) {
    const { name, email } = request.body;

    const createCustomerService = container.resolve(CreateCustomerService);
    try {
      const customer = await createCustomerService.execute({ name, email });
      return response.json(customer);
    } catch (error) {
      return next(error);
    }
  }

  public async update(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const { name, email } = request.body;
    const updateCustomerService = container.resolve(UpdateCustomerService);

    try {
      const customer = await updateCustomerService.execute({
        id,
        name,
        email,
      });

      return response.json(customer);
    } catch (error) {
      return next(error);
    }
  }

  public async delete(request: Request, response: Response, next: NextFunction) {
    const { id } = request.params;
    const deleteCustomerService = container.resolve(DeleteCustomerService);
    try {
      await deleteCustomerService.execute({ id });

      return response.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

export default CustomersController;
