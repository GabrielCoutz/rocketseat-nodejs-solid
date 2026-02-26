import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository.js';

import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js';
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error.js';
import { GetUserProfileService } from '@/services/get-user-profile.js';

import { hash } from 'bcryptjs';

import { beforeEach, describe, expect, it } from 'vitest';

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe('Get user profile service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'example@gmail.com',
      password_hash: await hash('123456', 6),
    });

    const { user } = await sut.execute({
      id: createdUser.id,
    });

    expect(user.id).toEqual(createdUser.id);
  });

  it('should not be able to get user profile with invalid id', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'example@example.com',
      password_hash: await hash('123456', 6),
    });

    await expect(() =>
      sut.execute({
        id: 'invalid-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
