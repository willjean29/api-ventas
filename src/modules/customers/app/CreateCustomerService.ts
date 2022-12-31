import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { ICustomer } from '../domain/models/ICustomer';
import { inject, injectable } from 'tsyringe';

@injectable()
class CreateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}
  public async execute({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const emailExists = await this.customersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    const redisCache = RedisCache.getInstance();
    const customer = await this.customersRepository.create({
      name,
      email,
    });

    await redisCache.invalidate('api-vendas-CUSTOMER_LIST');

    return customer;
  }
}

export default CreateCustomerService;
