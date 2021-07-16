import { Statement } from "../../entities/Statement";
import { ICreateStatementDTO } from "../../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "../../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "../IStatementsRepository";

export class InMemoryStatementsRepository implements IStatementsRepository {
  private statements: Statement[] = [];

  async create(data: ICreateStatementDTO): Promise<Statement> {
    const statement = new Statement();

    Object.assign(statement, data);

    this.statements.push(statement);

    return statement;
  }

  async transfer(data: ICreateTransferDTO): Promise<Statement> {
    const statement = new Statement();

    Object.assign(data, { type: 'Transfer' });

    Object.assign(statement, data);

    this.statements.push(statement);

    return statement;
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.statements.find(operation => (
      operation.id === statement_id &&
      operation.user_id === user_id
    ));
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    > {
    const statements = this.statements.filter(operation => operation.user_id === user_id);
    const transfer = this.statements.filter(operation => operation.sender_id === user_id);

    const statementBalance = statements.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.type === 'transfer') {
        return acc + operation.amount;
      } else {
        return acc - operation.amount;
      }
    }, 0);

    const transferBalance = transfer.reduce((acc, operation) => {
      return acc + operation.amount;
    }, 0);

    const balance = statementBalance - transferBalance;
    const all = [...statements, ...transfer];

    const statement = all.map(statement => {
      const serialized = {
        id: statement.id,
        amount: statement.amount,
        description: statement.description,
        type: statement.type,
        created_at: statement.created_at,
        updated_at: statement.updated_at
      }

      if (!statement.sender_id) {
        return serialized as Statement;
      };

      Object.assign(serialized, { sender_id: statement.sender_id });
      return serialized as Statement;
    });

    if (with_statement) {
      return {
        statement,
        balance
      }
    }

    return { balance }
  }
}
