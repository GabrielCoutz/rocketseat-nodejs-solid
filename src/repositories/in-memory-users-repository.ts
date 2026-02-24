import type { IUsersRepository } from '@/repositories/users-repository.js'
import type { Prisma } from 'generated/prisma/browser.js'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements IUsersRepository{
  public users: any[] = []

  async create(data: Prisma.UserCreateInput): Promise<Prisma.UserCreateInput> {
    const user = {
      id: randomUUID(),
      ...data,
    }

    this.users.push(user)

    return user
  }
}
