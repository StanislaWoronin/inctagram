import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user/user.repository';

export class DeleteUserByIdCommand {
  constructor(public readonly id: string) {}
}

@CommandHandler(DeleteUserByIdCommand)
export class DeleteUserByIdCommandHandler
  implements ICommandHandler<DeleteUserByIdCommand, boolean>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: DeleteUserByIdCommand): Promise<boolean> {
    return await this.userRepository.deleteUser(command.id);
  }
}
