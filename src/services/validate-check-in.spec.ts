import { InMemoryCheckInsRepository } from '@/repositories/in-memory-check-ins-repository.js';
import { LateCheckInValidationError } from '@/services/errors/late-check-in-validation-error.js';
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error.js';
import { ValidateCheckInService } from '@/services/validate-check-in.js';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInService;

describe('Validate check-in service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInService(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to validate a check-in', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const newCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id',
    });

    const { checkIn } = await sut.execute({
      checkInId: newCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository?.checkIns?.[0]?.validated_at).toEqual(
      expect.any(Date)
    );
  });

  it('should not be able to validate inexistent check-in', async () => {
    // vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it('should not be able to validate check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const newCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id',
      user_id: 'user-id',
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: newCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
