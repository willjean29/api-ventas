import { Repository, EntityManager } from 'typeorm';
import { AppDataSource } from '@shared/infra/typeorm';
import Customer from '../entities/Customer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';

class CustomersRepository implements ICustomersRepository {
  private repository: Repository<Customer>;
  constructor() {
    this.repository = new Repository(Customer, new EntityManager(AppDataSource));
  }

  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = this.repository.create({ name, email });
    await this.repository.save(customer);
    return customer;
  }

  public async save(customer: Customer) {
    await this.repository.save(customer);
    return customer;
  }

  public async findAll(): Promise<Customer[]> {
    const customers = this.repository.find();
    return customers;
  }

  public async findByName(name: string): Promise<Customer | null> {
    const customer = this.repository.findOne({
      where: {
        name,
      },
    });
    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.repository.findOne({
      where: {
        email,
      },
    });
    return customer;
  }

  public async findById(id: string): Promise<Customer | null> {
    const customer = this.repository.findOne({
      where: {
        id,
      },
    });
    return customer;
  }
  public async remove(customer: Customer): Promise<void> {
    await this.repository.remove(customer);
  }
}

export default CustomersRepository;
