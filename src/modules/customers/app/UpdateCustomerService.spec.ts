import FakeCustomersRepository from '@modules/customers/infra/typeorm/repositories/fakes/FakeCustomersRepository';
import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import UpdateCustomerService from './UpdateCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let updateCustomerService: UpdateCustomerService;

describe('UpdateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    updateCustomerService = new UpdateCustomerService(fakeCustomersRepository);
  });

  afterAll(() => {
    const redisCache = RedisCache.getInstance();
    redisCache.disconnect();
  });

  it('should be able to update customer', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
    });

    const response = await updateCustomerService.execute({
      id: customer.id,
      name: 'Jean',
      email: 'jean.osco@gmail.com',
    });

    expect(response).toHaveProperty('id');
  });

  it('should not be able to update customer if not exists', async () => {
    expect(
      updateCustomerService.execute({
        id: '5646df6g4dfg56df65gd',
        name: 'Jean',
        email: 'jean.osco@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update customer if email property exists', async () => {
    await fakeCustomersRepository.create({
      name: 'Jean Williams',
      email: 'jean.osco@gmail.com',
    });
    const customer = await fakeCustomersRepository.create({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
    });
    expect(
      updateCustomerService.execute({
        id: customer.id,
        name: 'Jean',
        email: 'jean.osco@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
