import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let hashProvider: FakeHashProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(fakeUsersRepository, hashProvider);
  });

  afterAll(() => {
    const redisCache = RedisCache.getInstance();
    redisCache.disconnect();
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a two user whit the same email', async () => {
    await createUserService.execute({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
      password: '123456',
    });

    expect(
      createUserService.execute({
        name: 'Jean Osco',
        email: 'willjean29@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
