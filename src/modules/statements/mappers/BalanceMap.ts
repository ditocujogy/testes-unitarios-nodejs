import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({ statement, balance }: { statement: Statement[], balance: number }) {
    const parsedStatement = statement.map((statement) => {
      if (!statement.sender_id) return {
        id: statement.id,
        amount: Number(statement.amount),
        description: statement.description,
        type: statement.type,
        created_at: statement.created_at,
        updated_at: statement.updated_at
      }
      else return {
        id: statement.id,
        sender_id: statement.sender_id,
        amount: Number(statement.amount),
        description: statement.description,
        type: statement.type,
        created_at: statement.created_at,
        updated_at: statement.updated_at
      }
    }
    );

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
