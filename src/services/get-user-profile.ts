import type { IUsersRepository } from '@/repositories/users-repository.js';
import { ResourceNotFoundError } from '@/services/errors/resource-not-found-error.js';
import type { User } from 'generated/prisma/browser.js';

export interface IGetUserProfileServiceRequest {
  id: string;
}

export interface IGetUserProfileServiceResponse {
  user: User;
}

export class GetUserProfileService {
  constructor(private userRepository: IUsersRepository) {}

  async execute({
    id,
  }: IGetUserProfileServiceRequest): Promise<IGetUserProfileServiceResponse> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new ResourceNotFoundError();

    return {
      user,
    };
  }
}
