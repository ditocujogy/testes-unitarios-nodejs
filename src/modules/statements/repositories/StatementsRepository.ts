import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { OperationType } from "../useCases/createStatement/CreateStatementController";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { ICreateTransferDTO } from "../useCases/createTransfer/ICreateTransferDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;

  constructor() {
    this.repository = getRepository(Statement);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async transfer({ user_id, sender_id, amount, description }: ICreateTransferDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      sender_id,
      type: 'transfer' as OperationType,
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
  }

  async getUserBalance({ user_id, with_statement = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | { balance: number, statement: Statement[] }
    > {
    const statements = await this.repository.find({
      where: { user_id }
    });
    const transfer = await this.repository.find({
      where: { sender_id: user_id }
    });

    const statementAmount = statements.reduce((acc, operation) => {
      if (operation.type === 'deposit' || operation.type === 'transfer') {
        return acc + +operation.amount;
      } else {
        return acc - +operation.amount;
      }
    }, 0);

    const transferAmount = transfer.reduce((acc, operation) => {
      return acc + +operation.amount;
    }, 0);

    const balance = statementAmount - transferAmount;
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
