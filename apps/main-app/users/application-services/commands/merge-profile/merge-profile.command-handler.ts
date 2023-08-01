import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../db.providers/users/user.repository';
import { ViewUser } from '../../../view-model/user.view-model';
import { EmailDto } from '../../../../auth/dto/email.dto';
import { TRegistrationViaThirdPartyServices } from '../../../../auth/dto/registration-via-third-party-services.dto';
import { WithClientMeta } from '../../../../auth/dto/session-id.dto';
import { randomUUID } from 'crypto';
import { TokensFactory } from '../../../../../../libs/shared/tokens.factory';

export class MergeProfileCommand {
  constructor(public readonly dto: WithClientMeta<EmailDto>) {}
}

@CommandHandler(MergeProfileCommand)
export class MergeProfileCommandHandler
  implements
    ICommandHandler<MergeProfileCommand, TRegistrationViaThirdPartyServices>
{
  constructor(
    private factory: TokensFactory,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({
    dto,
  }: MergeProfileCommand): Promise<TRegistrationViaThirdPartyServices | null> {
    const deviceId = randomUUID();
    const createdUser = await this.userRepository.mergeUserProfile(
      dto,
      deviceId,
    );

    const tokens = await this.factory.getPairTokens(createdUser.id, deviceId);
    const viewUser = await ViewUser.toView(createdUser);
    return { user: viewUser, ...tokens };
  }
}
