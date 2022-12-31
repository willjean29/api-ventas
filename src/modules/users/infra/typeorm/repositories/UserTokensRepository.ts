import { Repository, EntityManager } from 'typeorm';
import { AppDataSource } from '@shared/infra/typeorm';
import UserToken from '../entities/UserToken';
import { IUserTokensRepository } from '../../../domain/repositories/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
  private repository: Repository<UserToken>;
  constructor() {
    this.repository = new Repository(UserToken, new EntityManager(AppDataSource));
  }

  public async findByToken(token: string): Promise<UserToken | null> {
    const user = this.repository.findOne({
      where: {
        token,
      },
    });
    return user;
  }

  public async generate(user_id: string): Promise<UserToken> {
    const user = this.repository.create({
      user_id,
    });
    return user;
  }
}

export default UserTokensRepository;
