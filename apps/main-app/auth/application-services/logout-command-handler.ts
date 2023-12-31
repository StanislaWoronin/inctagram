import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../users/db.providers/users/user.repository';
import { ProfileRepository } from '../../users/db.providers/profile/profile.repository';

export class LogoutCommand {
  constructor(public readonly deviceId: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler
  implements ICommandHandler<LogoutCommand, boolean>
{
  constructor(private profileRepository: ProfileRepository) {}

  async execute({ deviceId }: LogoutCommand) {
    return await this.profileRepository.removeDeviceId(deviceId);
  }
}
