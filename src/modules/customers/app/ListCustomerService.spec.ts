import FakeCustomersRepository from '@modules/customers/infra/typeorm/repositories/fakes/FakeCustomersRepository';
import RedisCache from '@shared/cache/RedisCache';
import ListCustomerService from './ListCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let listCustomerService: ListCustomerService;

describe('ListCustomers', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    listCustomerService = new ListCustomerService(fakeCustomersRepository);
  });

  afterAll(() => {
    const redisCache = RedisCache.getInstance();
    redisCache.disconnect();
  });

  it('should be able to list customers', async () => {
    const customers = await listCustomerService.execute();

    expect(customers.length).toBeGreaterThanOrEqual(0);
  });
});
