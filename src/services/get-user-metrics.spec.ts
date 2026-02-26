import { InMemoryCheckInsRepository } from '@/repositories/in-memory-check-ins-repository.js';
import { GetUserMetricsService } from '@/services/get-user-metrics.js';

import { beforeEach, describe, expect, it } from 'vitest';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsService;

describe('Get user metrics service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsService(checkInsRepository);
  });

  it('should be able to fetch check in history', async () => {
    for (let i = 1; i <= 3; i++)
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      });

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    });

    expect(checkInsCount).toBe(3);
  });
});
