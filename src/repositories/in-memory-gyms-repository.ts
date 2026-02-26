import type { IGymsRepository } from '@/repositories/gym-repository.js';
import { Decimal } from '@prisma/client/runtime/index-browser';
import type { Gym } from 'generated/prisma/browser.js';
import type { GymCreateInput } from 'generated/prisma/models.js';

export class InMemoryGymsRepository implements IGymsRepository {
  public gyms: Gym[] = [];

  async findById(id: string) {
    const gym = this.gyms.find(gym => gym.id === id);

    if (!gym) return null;

    return gym;
  }

  async create(data: GymCreateInput) {
    const gym: Gym = {
      title: data.title,
      id: data?.id ?? crypto.randomUUID(),
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
    };

    this.gyms.push(gym);

    return gym;
  }
}
