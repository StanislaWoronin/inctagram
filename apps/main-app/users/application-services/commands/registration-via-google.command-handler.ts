import { RegistrationViaThirdPartyServicesDto } from '../../../auth/dto/registration-via-third-party-services.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TCreateUserResponse } from './create-user.command-handler';
import { UserRepository } from '../../db.providers/user/user.repository';
import { RegistrationViaGitHubCommand } from './registration-via-git-hub.command-handler';

export class RegistrationViaGoogleCommand {
  constructor(public readonly dto: RegistrationViaThirdPartyServicesDto) {}
}

@CommandHandler(RegistrationViaGoogleCommand)
export class RegistrationViaGoogleCommandHandler
  implements
    ICommandHandler<RegistrationViaGoogleCommand, TCreateUserResponse | null>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TCreateUserResponse | null> {
    return {} as TCreateUserResponse;
  }
}
