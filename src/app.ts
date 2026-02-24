import { env } from '@/env/index.js'
import { appRoutes } from '@/http/routes.js'

import fastify from 'fastify'
import { ZodError } from 'zod'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, request, reply) => {
  if(error instanceof ZodError) {
    return reply.status(400).send({ error: 'Validation Error', details: error.format() })
  }

  if(env.NODE_ENV !== 'prod') console.error(error);
  else {}

  
  return reply.status(500).send({ message: 'Internal Server Error' })
})