import { v4 as uuidv4 } from 'uuid';
import User from '@modules/users/infra/typeorm/entities/User';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(data: ICreateUser): Promise<User> {
    const user = new User();
    user.id = uuidv4();
    user.name = data.name;
    user.email = data.email;
    user.password = data.password;
    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async findAll(): Promise<User[]> {
    return this.users;
  }

  public async findByName(name: string): Promise<User | null> {
    const user = this.users.find(user => user.name === name);
    return user ? user : null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(user => user.email === email);
    return user ? user : null;
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.id === id);
    return user ? user : null;
  }
}

export default FakeUsersRepository;
