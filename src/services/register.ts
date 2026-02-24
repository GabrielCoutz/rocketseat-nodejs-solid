import type { IUsersRepository } from '@/repositories/users-repository.js'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error.js'
import { hash } from 'bcryptjs'


interface IRegisterService {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private userRepository: IUsersRepository) {}

  async execute(payload: IRegisterService) {
    const user = await this.userRepository.findByEmail(payload.email)
    if (user) throw new UserAlreadyExistsError()


    const password_hash = await hash(payload.password, 6)

    await this.userRepository.create({
     email: payload.email,
     name: payload.name, 
      password_hash,
    })
  }
}
