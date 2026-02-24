import { registerController } from '@/http/controllers/register.js'
import type { FastifyInstance } from 'fastify'

export const appRoutes = async (app: FastifyInstance) => {
  app.post('/users', registerController)
}
