import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createdUser: User;

describe('Get balance test', () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);

    const user: ICreateUserDTO = {
      name: 'john doe',
      email: 'john.doe@mail.com',
      password: 'password'
    };

    createdUser = await createUserUseCase.execute(user);
  });

  it('should be able to get a single statement from the user', async () => {
    const deposit: ICreateStatementDTO = {
      amount: 1500,
      description: 'any deposit',
      type: 'deposit' as OperationType,
      user_id: createdUser.id as string
    };

    const createdStatement = await createStatementUseCase.execute(deposit);

    const statement = await getStatementOperationUseCase.execute({
      user_id: createdUser.id as string,
      statement_id: createdStatement.id as string
    });

    expect(statement.amount).toEqual(1500);
  });
});
