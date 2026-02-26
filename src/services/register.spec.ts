import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository.js';
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error.js';
import { RegisterService } from '@/services/register.js';
import { compare } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';

let usersRepository: InMemoryUsersRepository;
let sut: RegisterService;

describe('Register service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterService(usersRepository);
  });

  it('should hash user password', async () => {
    const { createdUser } = await sut.execute({
      name: 'John Doe',
      email: 'email@example.com',
      password: 'password123',
    });

    const isPasswordCorrectlyHashed = await compare(
      'password123',
      createdUser.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not allow to register with an email that is already in use', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'email@example.com',
      password: 'password123',
    });

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'email@example.com',
        password: 'password123',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });

  it('should be able to register a new user', async () => {
    const { createdUser } = await sut.execute({
      name: 'John Doe',
      email: 'email@example.com',
      password: 'password123',
    });

    expect(createdUser).toHaveProperty('id');
  });
});
