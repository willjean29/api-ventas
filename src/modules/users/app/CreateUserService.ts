import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';
import { ICreateUser } from '../domain/models/ICreateUser';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import { IHashProvider } from '../providers/HashProvider/models/IHashProvider';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}
  public async execute({ name, email, password }: ICreateUser): Promise<IUser> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('There is already one user with this email');
    }
    const redisCache = RedisCache.getInstance();
    const hashedPassword = await this.hashProvider.generateHash(password);
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await redisCache.invalidate('api-vendas-USER_LIST');

    return user;
  }
}

export default CreateUserService;
