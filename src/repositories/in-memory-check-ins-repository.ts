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
}
