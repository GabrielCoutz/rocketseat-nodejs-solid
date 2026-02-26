import type { IUsersRepository } from '@/repositories/users-repository.js';
import type { Prisma } from 'generated/prisma/browser.js';
import { prisma } from 'lib/prisma.js';

export class PrismaUsersRepository implements IUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({ data });
    return user;
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: string) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
