import FakeCustomersRepository from '@modules/customers/infra/typeorm/repositories/fakes/FakeCustomersRepository';
import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import CreateCustomerService from './CreateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let createCustomerService: CreateCustomerService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    createCustomerService = new CreateCustomerService(fakeCustomersRepository);
  });

  afterAll(() => {
    const redisCache = RedisCache.getInstance();
    redisCache.disconnect();
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomerService.execute({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
    });

    expect(customer).toHaveProperty('id');
  });

  it('should not be able to create a two customer whit the same email', async () => {
    await createCustomerService.execute({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
    });

    expect(
      createCustomerService.execute({
        name: 'Jean Osco',
        email: 'willjean29@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
