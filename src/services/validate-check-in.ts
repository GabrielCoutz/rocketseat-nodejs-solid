import type { ICheckInsRepository } from '@/repositories/check-ins-repository.js';
import { LateCheckInValidationError } from '@/services/errors/late-check-in-validation-error.js';

import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error.js';
import dayjs from 'dayjs';

import type { CheckIn } from 'generated/prisma/browser.js';

export interface IValidateCheckInServiceRequest {
  checkInId: string;
}

export interface IValidateCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute(
    payload: IValidateCheckInServiceRequest
  ): Promise<IValidateCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(payload.checkInId);

    if (!checkIn) throw new ResourceNotFoundError();

    const distanceInMinutesFromCheckInCreatinon = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes'
    );

    if (distanceInMinutesFromCheckInCreatinon > 20)
      throw new LateCheckInValidationError();

    checkIn.validated_at = new Date();

    const updatedCheckIn = await this.checkInsRepository.save(checkIn);

    return {
      checkIn: updatedCheckIn,
    };
  }
}
