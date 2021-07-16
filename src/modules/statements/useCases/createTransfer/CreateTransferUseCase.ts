import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

@injectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, sender_id, amount, description }: ICreateTransferDTO) {
    if (user_id === sender_id) {
      throw new CreateTransferError.WrongOperation();
    };

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new CreateTransferError.UserNotFound();
    };

    if (!sender_id) {
      throw new CreateTransferError.UserNotFound();
    };

    const sender = await this.usersRepository.findById(sender_id);

    if (!sender) {
      throw new CreateTransferError.UserNotFound();
    };

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id });

    if (balance < amount) {
      throw new CreateTransferError.InsufficientFunds();
    };

    const statementOperation = await this.statementsRepository.transfer({
      user_id,
      sender_id,
      amount,
      description
    });

    return statementOperation;
  }
}
