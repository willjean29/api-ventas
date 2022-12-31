import AppError from '@shared/errors/AppError';
import { hash, compare } from 'bcrypt';
import { IUser } from '../domain/models/IUser';
import { IUpdateProfile } from '../domain/models/IUpdateProfile';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import RedisCache from '@shared/cache/RedisCache';

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({ user_id, name, email, password, old_password }: IUpdateProfile): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);
    const redisCache = RedisCache.getInstance();

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const userUpdateEmail = await this.usersRepository.findByEmail(email);

    if (userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new AppError('There is already one user with this email');
    }

    if (password && !old_password) {
      throw new AppError('You need to inform the old password to set a new password');
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError('Old password does not match');
      }

      user.password = await hash(password, 10);
    }

    user.name = name;
    user.email = email;

    await this.usersRepository.save(user);
    await redisCache.invalidate('api-vendas-USER_LIST');

    return user;
  }
}

export default UpdateProfileService;
