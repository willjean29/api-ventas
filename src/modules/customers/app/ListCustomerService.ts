import RedisCache from '@shared/cache/RedisCache';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { ICustomer } from '../domain/models/ICustomer';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}
  public async execute(): Promise<ICustomer[]> {
    const redisCache = RedisCache.getInstance();

    let customers = await redisCache.recover<ICustomer[]>('api-vendas-CUSTOMER_LIST');

    if (!customers) {
      customers = await this.customersRepository.findAll();
      await redisCache.save('api-ventas-CUSTOMER_LIST', customers);
    }

    return customers;
  }
}

export default ListCustomerService;
