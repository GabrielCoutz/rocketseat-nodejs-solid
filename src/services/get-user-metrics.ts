import type { ICheckInsRepository } from '@/repositories/check-ins-repository.js';

export interface IGetUserMetricsServiceRequest {
  userId: string;
}

export interface IGetUserMetricsServiceResponse {
  checkInsCount: number;
}

export class GetUserMetricsService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute(
    payload: IGetUserMetricsServiceRequest
  ): Promise<IGetUserMetricsServiceResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(
      payload.userId
    );

    return {
      checkInsCount,
    };
  }
}
