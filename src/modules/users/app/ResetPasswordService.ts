import { addHours, isAfter } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcrypt';
import { IResetPassword } from '../domain/models/IResetPassword';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}
  public async execute({ token, password }: IResetPassword): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User Token does not exist');
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exist');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(tokenCreatedAt, compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await hash(password, 10);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
