import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository.js';
import { RegisterService } from '@/services/register.js';

export const makeRegisterService = (): RegisterService => {
  const usersRepository = new InMemoryUsersRepository();
  const registerService = new RegisterService(usersRepository);

  return registerService;
};
