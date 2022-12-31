import AppError from '@shared/errors/AppError';
import { IUpdateCustomer } from '../domain/models/IUpdateCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { ICustomer } from '../domain/models/ICustomer';
import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id, name, email }: IUpdateCustomer): Promise<ICustomer> {
    const customer = await this.customersRepository.findById(id);
    const redisCache = RedisCache.getInstance();
    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists && email !== customer.email) {
      throw new AppError('Customer already exists');
    }

    customer.name = name;
    customer.email = email;

    await this.customersRepository.save(customer);
    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');
    return customer;
  }
}

export default UpdateCustomerService;
