import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create user test', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  })

  it('should be able to create a new user', async () => {
    const user = {
      name: 'John doe',
      email: 'johndoe@mail.com',
      password: '123'
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const createdUser = await usersRepository.findByEmail(user.email);

    expect(createdUser).toHaveProperty('id');
  });
})
