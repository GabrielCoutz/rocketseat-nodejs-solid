import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js';
import { makeAutenticateService } from '@/services/factories/make-autenticate-service.js';

import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export const authenticateController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  });

  const payload = authenticateBodySchema.parse(request.body);

  try {
    const authenticateService = makeAutenticateService();

    await authenticateService.execute(payload);
  } catch (error) {
    if (error instanceof InvalidCredentialsError)
      return reply.status(400).send({ message: error.message });

    throw error;
  }

  return reply.status(200).send();
};
