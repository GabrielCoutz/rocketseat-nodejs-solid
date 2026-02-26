import type { ICheckInsRepository } from '@/repositories/check-ins-repository.js';
import dayjs from 'dayjs';
import type { CheckIn, Prisma } from 'generated/prisma/browser.js';
import { randomUUID } from 'node:crypto';

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public checkIns: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: data?.id ?? randomUUID(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data?.validated_at ? new Date(data.validated_at) : null,
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date');
    const endOfTheDay = dayjs(date).endOf('date');

    const checkInOnSameDate = this.checkIns.find(checkIn => {
      const isSameUser = checkIn.user_id === userId;
      if (!isSameUser) return null;

      const checkInDate = dayjs(checkIn.created_at);
      const isSameDay =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return isSameDay;
    });

    return checkInOnSameDate || null;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.checkIns
      .filter(checkIn => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20);

    return Promise.resolve(checkIns);
  }

  async countByUserId(userId: string): Promise<number> {
    const count = this.checkIns.filter(
      checkIn => checkIn.user_id === userId
    ).length;

    return Promise.resolve(count);
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIns.find(checkIn => checkIn.id === id);

    if (!checkIn) return Promise.resolve(null);

    return Promise.resolve(checkIn);
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const checkInIndex = this.checkIns.findIndex(
      item => item.id === checkIn.id
    );

    this.checkIns[checkInIndex] = checkIn;

    return Promise.resolve(checkIn);
  }
}
