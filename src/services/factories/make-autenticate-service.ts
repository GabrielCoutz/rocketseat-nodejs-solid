import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository.js';
import { AuthenticateService } from '@/services/authenticate.js';

export const makeAutenticateService = (): AuthenticateService => {
  const usersRepository = new InMemoryUsersRepository();
  const autenticateService = new AuthenticateService(usersRepository);

  return autenticateService;
};
