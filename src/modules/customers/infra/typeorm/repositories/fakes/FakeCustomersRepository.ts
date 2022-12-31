import { v4 as uuidv4 } from 'uuid';
import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';

class FakeCustomersRepository implements Omit<ICustomersRepository, 'remove' | 'findAll'> {
  private customers: Customer[] = [];

  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = new Customer();
    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;
    this.customers.push(customer);
    return customer;
  }

  public async save(customer: Customer) {
    // Object.assign(this.customers, customer);
    // return customer;
    const findIndex = this.customers.findIndex(findCustomer => findCustomer.id === customer.id);

    this.customers[findIndex] = customer;

    return customer;
  }

  public async findAll(): Promise<Customer[]> {
    return this.customers;
  }

  public async findByName(name: string): Promise<Customer | null> {
    const customer = this.customers.find(customer => customer.name === name);
    return customer ? customer : null;
  }

  public async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.customers.find(customer => customer.email === email);
    return customer ? customer : null;
  }

  public async findById(id: string): Promise<Customer | null> {
    const customer = this.customers.find(customer => customer.id === id);
    return customer ? customer : null;
  }

  public async remove(customer: Customer): Promise<void> {
    this.customers = this.customers.filter(c => c.id !== customer.id);
  }
}

export default FakeCustomersRepository;
