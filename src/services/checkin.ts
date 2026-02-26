import type { ICheckInsRepository } from '@/repositories/check-ins-repository.js';
import type { IGymsRepository } from '@/repositories/gym-repository.js';
import { MaxDistanceError } from '@/services/errors/max-distance-error.js';
import { MaxNumberOfCheckInsError } from '@/services/errors/max-number-of-check-ins-error.js';
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error.js';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js';

import type { CheckIn } from 'generated/prisma/browser.js';

export interface ICheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

export interface ICheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInsRepository: ICheckInsRepository,
    private gymsRepository: IGymsRepository
  ) {}

  async execute(
    payload: ICheckInServiceRequest
  ): Promise<ICheckInServiceResponse> {
    const gym = await this.gymsRepository.findById(payload.gymId);
    if (!gym) throw new ResourceNotFoundError();

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: payload.userLatitude,
        longitude: payload.userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      }
    );

    const MAX_DISTANCE_IN_KILOMETER = 0.1;

    if (distance > MAX_DISTANCE_IN_KILOMETER) throw new MaxDistanceError();

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      payload.userId,
      new Date()
    );

    if (checkInOnSameDate) throw new MaxNumberOfCheckInsError();

    const checkIn = await this.checkInsRepository.create({
      gym_id: payload.gymId,
      user_id: payload.userId,
    });

    return {
      checkIn,
    };
  }
}
