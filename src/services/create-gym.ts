import type { IGymsRepository } from '@/repositories/gym-repository.js';
import type { Gym } from 'generated/prisma/browser.js';

interface ICreateGymService {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface ICreateGymServiceResponse {
  createdGym: Gym;
}

export class CreateGymService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute(
    payload: ICreateGymService
  ): Promise<ICreateGymServiceResponse> {
    const createdGym = await this.gymsRepository.create(payload);

    return {
      createdGym,
    };
  }
}
