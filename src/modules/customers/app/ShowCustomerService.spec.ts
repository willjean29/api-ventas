import FakeCustomersRepository from '@modules/customers/infra/typeorm/repositories/fakes/FakeCustomersRepository';
import AppError from '@shared/errors/AppError';
import ShowCustomerService from './ShowCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let showCustomerService: ShowCustomerService;

describe('ShowCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    showCustomerService = new ShowCustomerService(fakeCustomersRepository);
  });

  it('should be able to show a customer by Id', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Jean Osco',
      email: 'willjean29@gmail.com',
    });
    const response = await showCustomerService.execute({ id: customer.id });

    expect(response).toHaveProperty('id');
  });

  it('should not be able to show a customer if not exists', async () => {
    expect(showCustomerService.execute({ id: '46ds4fsd6f465sd56sd56f454' })).rejects.toBeInstanceOf(AppError);
  });
});
