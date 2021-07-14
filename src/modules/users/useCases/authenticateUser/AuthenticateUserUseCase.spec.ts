import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authentication test', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  })

  it('should be able to authenticate the user', async () => {
    const user: ICreateUserDTO = {
      name: 'john doe',
      email: 'john.doe@mail.com',
      password: 'password'
    };

    await createUserUseCase.execute({ name: user.name, email: user.email, password: user.password });

    const response = await authenticateUserUseCase.execute({ email: user.email, password: user.password });

    expect(response).toHaveProperty('token');
  });
});
