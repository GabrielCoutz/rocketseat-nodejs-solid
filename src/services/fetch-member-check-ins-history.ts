import type { ICheckInsRepository } from '@/repositories/check-ins-repository.js';
import type { CheckIn } from 'generated/prisma/browser.js';

export interface IFetchUserServiceRequest {
  userId: string;
  page: number;
}

export interface IFetchUserServiceResponse {
  checkIns: CheckIn[];
}

export class FetchUserService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute(
    payload: IFetchUserServiceRequest
  ): Promise<IFetchUserServiceResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      payload.userId,
      payload.page
    );

    return {
      checkIns,
    };
  }
}
