import { InMemoryCheckInsRepository } from '@/repositories/in-memory-check-ins-repository.js';
import { FetchUserService } from '@/services/fetch-member-check-ins-history.js';

import { beforeEach, describe, expect, it } from 'vitest';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserService;

describe('Fetch check-in history service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserService(checkInsRepository);
  });

  it('should be able to fetch check in history', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    });

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    });

    expect(checkIns).toHaveLength(1);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-01',
        user_id: 'user-01',
      }),
    ]);
  });

  it('should be able to fetch paginated check in history', async () => {
    for (let i = 1; i <= 22; i++)
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      });

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: 'gym-21',
        user_id: 'user-01',
      }),
      expect.objectContaining({
        gym_id: 'gym-22',
        user_id: 'user-01',
      }),
    ]);
  });
});
