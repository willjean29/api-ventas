import FakeCustomersRepository from '@modules/customers/infra/typeorm/repositories/fakes/FakeCustomersRepository';
import RedisCache from '@shared/cache/RedisCache';
import AppError from '@shared/errors/AppError';
import DeleteCustomerService from './DeleteCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let deleteCustomerService: DeleteCustomerService;

describe('DeleteCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    deleteCustomerService = new DeleteCustomerService(fakeCustomersRepository);
  });

  afterAll(() => {
    const redisCache = RedisCache.getInstance();
    redisCache.disconnect();
  });

  it('should be able to delete a customer by Id', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
    });
    const response = await deleteCustomerService.execute({ id: customer.id });

    expect(response).toHaveProperty('id');
  });

  it('should not be able to show a customer if not exists', async () => {
    expect(deleteCustomerService.execute({ id: '46ds4fsd6f465sd56sd56f454' })).rejects.toBeInstanceOf(AppError);
  });
});
