import type { IGymsRepository } from '@/repositories/gym-repository.js';
import type { Gym } from 'generated/prisma/browser.js';

interface IFetchNearbyGymsService {
  userLatitude: number;
  userLongitude: number;
}

interface IFetchNearbyGymsServiceResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsService): Promise<IFetchNearbyGymsServiceResponse> {
    const gyms = await this.gymsRepository.findManyNearby(
      userLatitude,
      userLongitude
    );

    return {
      gyms,
    };
  }
}
