import RedisCache from '@shared/cache/RedisCache';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute(): Promise<IUser[]> {
    const redisCache = RedisCache.getInstance();

    let users = await redisCache.recover<IUser[]>('api-vendas-USER_LIST');

    if (!users) {
      users = await this.usersRepository.findAll();
      await redisCache.save('api-ventas-USER_LIST', users);
    }

    return users;
  }
}

export default ListUserService;
