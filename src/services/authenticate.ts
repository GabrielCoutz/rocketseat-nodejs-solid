import type { IUsersRepository } from '@/repositories/users-repository.js';
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error.js';
import { compare } from 'bcryptjs';
import type { User } from 'generated/prisma/browser.js';

export interface IAuthenticateServiceRequest {
  email: string;
  password: string;
}

export interface IAuthenticateServiceResponse {
  user: User;
}

export class AuthenticateService {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateServiceRequest): Promise<IAuthenticateServiceResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new InvalidCredentialsError();

    const doesPasswordMatches = await compare(password, user.password_hash);
    if (!doesPasswordMatches) throw new InvalidCredentialsError();

    return {
      user,
    };
  }
}
