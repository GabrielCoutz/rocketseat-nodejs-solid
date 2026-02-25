import type { IUsersRepository } from '@/repositories/users-repository.js'
import type { Prisma, User } from 'generated/prisma/browser.js'
import { randomUUID } from 'node:crypto'

export class InMemoryUsersRepository implements IUsersRepository{
  public users: User[] = []

  async create(data: Prisma.UserCreateInput) {
    const user = {
      ...data,
      id: randomUUID(),
      created_at: new Date(),
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string) {
    const user = this.users.find((user) => user.email === email)

    if (!user) return null

    return user
  } 
}
