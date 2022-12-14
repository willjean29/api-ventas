import AppError from '@shared/errors/AppError';
import { IShowProfile } from '../domain/models/IShowProfile';
import { IUser } from '../domain/models/IUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
  public async execute({ user_id }: IShowProfile): Promise<IUser> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
}

export default ShowProfileService;
