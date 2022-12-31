import { Repository, EntityManager } from 'typeorm';
import { AppDataSource } from '@shared/infra/typeorm';
import User from '../entities/User';
import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = new Repository(User, new EntityManager(AppDataSource));
  }

  public async create(data: ICreateUser): Promise<User> {
    const user = this.repository.create(data);
    await this.repository.save(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    await this.repository.save(user);
    return user;
  }

  public async findAll(): Promise<User[]> {
    const users = this.repository.find();
    return users;
  }

  public async findByName(name: string): Promise<User | null> {
    const user = this.repository.findOne({
      where: {
        name,
      },
    });
    return user;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.repository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  public async findById(id: string): Promise<User | null> {
    const user = this.repository.findOne({
      where: {
        id,
      },
    });
    return user;
  }
}

export default UsersRepository;
