import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/infra/typeorm/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionsService from './CreateSessionsService';

let fakeUsersRepository: FakeUsersRepository;
let createSessionsService: CreateSessionsService;
let hashProvider: FakeHashProvider;

describe('CreateSessions', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    createSessionsService = new CreateSessionsService(fakeUsersRepository, hashProvider);
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
      password: '123456',
    });

    const response = await createSessionsService.execute({
      email: 'willjean29@gmail.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(user).toHaveProperty('id');
  });

  it('should not be able to authenticate non existent user', async () => {
    expect(
      createSessionsService.execute({
        email: 'willjean29@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
      password: '123456',
    });

    expect(
      createSessionsService.execute({
        email: 'willjean29@gmail.com',
        password: '1478523',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
