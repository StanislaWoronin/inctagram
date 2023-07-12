import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user.repository';

export class LogoutCommand {
  constructor(public readonly deviceId: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler
  implements ICommandHandler<LogoutCommand, boolean>
{
  constructor(private userRepository: UserRepository) {}

  async execute({ deviceId }: LogoutCommand) {
    return await this.userRepository.removeDeviceId(deviceId);
  }
}
