import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository.js';
import { AuthenticateService } from '@/services/authenticate.js';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js';
import { hash } from 'bcryptjs';

import { describe, expect, it } from 'vitest';

describe('Autenticate service', () => {
  it('should be able to autenticate', async () => {
    const usersRepository = new InMemoryUsersRepository();

    await usersRepository.create({
      name: 'John Doe',
      email: 'example@example.com',
      password_hash: await hash('123456', 6),
    });

    const sut = new AuthenticateService(usersRepository);

    const { user } = await sut.execute({
      email: 'example@example.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository();

    const sut = new AuthenticateService(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();

    await usersRepository.create({
      name: 'John Doe',
      email: 'example@example.com',
      password_hash: await hash('123456', 6),
    });

    const sut = new AuthenticateService(usersRepository);

    await expect(() =>
      sut.execute({
        email: 'examplasde@example.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
