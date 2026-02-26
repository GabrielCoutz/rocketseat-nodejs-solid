import type { IGymsRepository } from '@/repositories/gym-repository.js';
import type { Gym } from 'generated/prisma/browser.js';

interface ISearchGymsService {
  search: string;
  page: number;
}

interface ISearchGymsServiceResponse {
  gyms: Gym[];
}

export class SearchGymsService {
  constructor(private gymsRepository: IGymsRepository) {}

  async execute({
    search,
    page,
  }: ISearchGymsService): Promise<ISearchGymsServiceResponse> {
    const gyms = await this.gymsRepository.searchMany(search, page);

    return {
      gyms,
    };
  }
}
