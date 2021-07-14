import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show user test', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to return the authenticated user', async () => {
    const user: ICreateUserDTO = {
      name: 'john doe',
      email: 'john.doe@mail.com',
      password: 'johnthedoe'
    };

    const createdUser = await createUserUseCase.execute({ name: user.name, email: user.email, password: user.password });

    const returnedUser = await showUserProfileUseCase.execute(createdUser.id as string);

    expect(returnedUser).toHaveProperty('id');
    expect(returnedUser.email).toEqual('john.doe@mail.com');
  });
})
