import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

it('can create!', async () => {
  //create a fake copy of users service
  const fakeUsersService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) =>
      Promise.resolve({ id: 1, password }),
  };

  const module = await Test.createTestingModule({
    providers: [AuthService, {
        provide: UsersService,
        useValue:fakeUsersService
    }],
  }).compile();

  const service = module.get(AuthService);

  expect(service).toBeDefined();
});
