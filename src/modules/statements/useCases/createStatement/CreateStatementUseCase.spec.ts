import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "./CreateStatementController";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createdUser: User;

describe('Create statement test', () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);

    const user: ICreateUserDTO = {
      name: 'john doe',
      email: 'john.doe@mail.com',
      password: 'password'
    };

    createdUser = await createUserUseCase.execute(user);
  });

  it('should be able to create a deposit for the user', async () => {
    const statement: ICreateStatementDTO = {
      amount: 200,
      description: 'any deposit',
      type: 'deposit' as OperationType,
      user_id: createdUser.id as string
    }

    const createdStatement = await createStatementUseCase.execute(statement);

    expect(createdStatement.amount).toEqual(200);
    expect(createdStatement.type).toEqual('deposit');
    expect(createdStatement.user_id).toEqual(createdUser.id);
  });

  it('should be able to create a withdraw for the user', async () => {
    const statement: ICreateStatementDTO = {
      amount: 150,
      description: 'any withdraw',
      type: 'withdraw' as OperationType,
      user_id: createdUser.id as string
    }

    const createdStatement = await createStatementUseCase.execute(statement);

    expect(createdStatement.amount).toEqual(150);
    expect(createdStatement.type).toEqual('withdraw');
    expect(createdStatement.user_id).toEqual(createdUser.id);
  });

  it('should not be able to create a withdraw with invalid amount', async () => {
    const statement: ICreateStatementDTO = {
      amount: 1000,
      description: 'any withdraw',
      type: 'withdraw' as OperationType,
      user_id: createdUser.id as string
    }

    expect(async () => {
      await createStatementUseCase.execute(
        statement
      );
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
