import AppError from '@shared/errors/AppError';
import { IShowCustomer } from '../domain/models/IShowCustomer';
import { ICustomer } from '../domain/models/ICustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ShowCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}
  public async execute({ id }: IShowCustomer): Promise<ICustomer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found.', 404);
    }

    return customer;
  }
}

export default ShowCustomerService;
