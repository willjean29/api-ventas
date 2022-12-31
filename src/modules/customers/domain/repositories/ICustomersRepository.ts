import { ICreateCustomer } from '../models/ICreateCustomer';
import { ICustomer } from '../models/ICustomer';

export interface ICustomersRepository {
  findAll(): Promise<ICustomer[]>;
  findByName(name: string): Promise<ICustomer | null>;
  findByEmail(email: string): Promise<ICustomer | null>;
  findById(id: string): Promise<ICustomer | null>;
  create(data: ICreateCustomer): Promise<ICustomer>;
  save(data: ICreateCustomer): Promise<ICustomer>;
  remove(customer: ICustomer): Promise<void>;
}
