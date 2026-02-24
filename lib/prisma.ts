import { env } from '@/env/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from 'generated/prisma/client.js'

const connectionString = env.DATABASE_URL

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === 'dev' ? ['query', 'error'] : [],
})

export { prisma }
