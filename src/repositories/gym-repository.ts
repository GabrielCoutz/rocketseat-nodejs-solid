import type { Gym } from 'generated/prisma/browser.js';
import type { GymCreateInput } from 'generated/prisma/models.js';

export interface IGymsRepository {
  findById(id: string): Promise<Gym | null>;
  create(data: GymCreateInput): Promise<Gym>;
  searchMany(query: string, page: number): Promise<Gym[]>;
  findManyNearby(userLatitude: number, userLongitude: number): Promise<Gym[]>;
}
