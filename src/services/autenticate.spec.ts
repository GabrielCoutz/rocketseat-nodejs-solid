import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository.js';
import { AuthenticateService } from '@/services/authenticate.js';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js';
import { hash } from 'bcryptjs';

import { beforeEach, describe, expect, it } from 'vitest';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateService;

describe('Autenticate service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateService(usersRepository);
  });

  it('should be able to autenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'example@example.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      email: 'example@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'example@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'example@example.com',
        password: '1234567',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong email', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'example@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({
        email: 'examplasde@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
