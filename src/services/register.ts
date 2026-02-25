import type { IUsersRepository } from '@/repositories/users-repository.js'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error.js'
import { hash } from 'bcryptjs'
import type { User } from 'generated/prisma/browser.js'


interface IRegisterService {
  name: string
  email: string
  password: string
}

interface IRegisterServiceResponse {
  createdUser: User
}

export class RegisterService {
  constructor(private userRepository: IUsersRepository) {}

  async execute(payload: IRegisterService): Promise<IRegisterServiceResponse> {
    const user = await this.userRepository.findByEmail(payload.email)
    if (user) throw new UserAlreadyExistsError()


    const password_hash = await hash(payload.password, 6)

    const createdUser = await this.userRepository.create({
     email: payload.email,
     name: payload.name, 
      password_hash,
    })

    return {createdUser}
  }
}
