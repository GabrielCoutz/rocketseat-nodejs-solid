import { InMemoryGymsRepository } from '@/repositories/in-memory-gyms-repository.js';
import { CreateGymService } from '@/services/create-gym.js';

import { expect, describe, it, beforeEach } from 'vitest';

let gymRepository: InMemoryGymsRepository;
let sut: CreateGymService;

describe('Create Gym service', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymService(gymRepository);
  });

  it('should hash user password', async () => {
    const { createdGym } = await sut.execute({
      description: 'description test',
      latitude: 0,
      longitude: 0,
      phone: '',
      title: 'gym test',
    });

    expect(createdGym).toHaveProperty('id');
  });
});
