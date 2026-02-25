import { InMemoryUsersRepository } from '@/repositories/in-memory-users-repository.js'
import { UserAlreadyExistsError } from '@/services/errors/user-already-exists-error.js'
import { RegisterService } from '@/services/register.js'
import { compare } from 'bcryptjs'
import {expect,  describe, it} from 'vitest'


describe('Register service', () => {
  it('should hash user password', async () => {
    const usersRepository = new InMemoryUsersRepository()

    const  registerService = new RegisterService(usersRepository)

const {createdUser} = await registerService.execute({
  name: 'John Doe',
  email: 'email@example.com',
  password: 'password123'
})

const isPasswordCorrectlyHashed = await compare('password123', createdUser.password_hash)

expect(isPasswordCorrectlyHashed).toBe(true)
    

  })

  it('should not allow to register with an email that is already in use', async () => {
    const usersRepository = new InMemoryUsersRepository()

    const  registerService = new RegisterService(usersRepository)

    await registerService.execute({
      name: 'John Doe',
      email: 'email@example.com',
      password: 'password123'
    })

   expect(() => registerService.execute({
      name: 'John Doe',
      email: 'email@example.com',
      password: 'password123'
    })).rejects.toBeInstanceOf(UserAlreadyExistsError)



  })

  it('should be able to register a new user', async () => {
    const usersRepository = new InMemoryUsersRepository()

    const  registerService = new RegisterService(usersRepository)

    const {createdUser} = await registerService.execute({
      name: 'John Doe',
      email: 'email@example.com',
      password: 'password123'
    })

    expect(createdUser).toHaveProperty('id')
    })
})