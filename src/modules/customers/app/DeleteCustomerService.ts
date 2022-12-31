import AppError from '@shared/errors/AppError';
import { IDeleteCustomer } from '../domain/models/IDeleteCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { ICustomer } from '../domain/models/ICustomer';
import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}
  public async execute({ id }: IDeleteCustomer): Promise<ICustomer> {
    const customer = await this.customersRepository.findById(id);
    const redisCache = RedisCache.getInstance();
    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    await this.customersRepository.remove(customer);
    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');
    return customer;
  }
}

export default DeleteCustomerService;
