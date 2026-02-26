import type { IGymsRepository } from '@/repositories/gym-repository.js';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory-check-ins-repository.js';
import { InMemoryGymsRepository } from '@/repositories/in-memory-gyms-repository.js';
import { CheckInService } from '@/services/checkin.js';
import { MaxDistanceError } from '@/services/errors/max-distance-error.js';
import { MaxNumberOfCheckInsError } from '@/services/errors/max-number-of-check-ins-error.js';
import { Decimal } from '@prisma/client/runtime/index-browser';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInService;

describe('Check-in service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInService(checkInsRepository, gymsRepository);

    vi.useFakeTimers();

    await gymsRepository.create({
      id: 'gym-01',
      title: 'gym 1',
      description: 'description test',
      phone: '',
      latitude: 0,
      longitude: 0,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it('should be able to check in twice in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in on distant gym', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    gymsRepository.gyms.push({
      id: 'gym-02',
      title: 'gym 1',
      description: 'description test',
      phone: '',
      latitude: new Decimal(-23.4771681),
      longitude: new Decimal(-46.3199439),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.4571681,
        userLongitude: -46.3999439,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
