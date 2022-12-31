import AppError from '@shared/errors/AppError';
import StorageProvider from '@shared/providers/StoreProvider';
import { IUser } from '../domain/models/IUser';
import { IUpdateUserAvatar } from '../domain/models/IUpdateUserAvatar';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({ user_id, avatarFilename }: IUpdateUserAvatar): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);
    const redisCache = RedisCache.getInstance();
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const storeProvider = new StorageProvider();
    if (user.avatar) {
      await storeProvider.deleteFile(user.avatar);
    }

    const filename = await storeProvider.saveFile(avatarFilename);
    user.avatar = filename;

    await this.usersRepository.save(user);
    await redisCache.invalidate('api-vendas-USER_LIST');

    return user;
  }
}

export default UpdateUserAvatarService;
