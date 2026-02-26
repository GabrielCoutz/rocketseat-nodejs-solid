import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error.js';
import { makeRegisterService } from '@/services/factories/make-register-service.js';
import type { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

export const registerController = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  });

  const payload = registerBodySchema.parse(request.body);

  try {
    const registerService = makeRegisterService();

    await registerService.execute(payload);
  } catch (error) {
    if (error instanceof UserAlreadyExistsError)
      return reply.status(409).send({ message: error.message });

    throw error;
  }

  return reply.status(201).send();
};
