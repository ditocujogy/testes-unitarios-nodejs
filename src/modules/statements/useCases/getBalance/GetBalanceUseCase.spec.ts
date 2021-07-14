import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let createdUser: User;

describe('Get balance test', () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);

    const user: ICreateUserDTO = {
      name: 'john doe',
      email: 'john.doe@mail.com',
      password: 'password'
    };

    createdUser = await createUserUseCase.execute(user);
  });

  it('should be able to get the user balance', async () => {
    const deposit: ICreateStatementDTO = {
      amount: 1500,
      description: 'any deposit',
      type: 'deposit' as OperationType,
      user_id: createdUser.id as string
    };

    const withdraw: ICreateStatementDTO = {
      amount: 550,
      description: 'any withdraw',
      type: 'withdraw' as OperationType,
      user_id: createdUser.id as string
    };

    await createStatementUseCase.execute(deposit);
    await createStatementUseCase.execute(withdraw);

    const balance = await getBalanceUseCase.execute({ user_id: createdUser.id as string });

    expect(balance.balance).toEqual(950);
  });
});
