import { InMemoryGymsRepository } from '@/repositories/in-memory-gyms-repository.js';
import { FetchNearbyGymsService } from '@/services/fetch-nearby-gyms.js';

import { beforeEach, describe, expect, it } from 'vitest';

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsService;

describe('Fetch Nearby Gyms', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsService(gymsRepository);
  });

  it('should be able to fetch nearby gyms', async () => {
    await Promise.all([
      gymsRepository.create({
        title: 'Far Gym',
        description: null,
        phone: null,
        latitude: -23.4571681,
        longitude: -46.3999439,
      }),

      gymsRepository.create({
        title: 'Near Gym',
        description: null,
        phone: null,
        latitude: -22.5469884,
        longitude: -44.1460527,
      }),
    ]);

    const { gyms } = await sut.execute({
      userLatitude: -22.5549152,
      userLongitude: -44.1745485,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Near Gym',
        }),
      ])
    );
  });
});
