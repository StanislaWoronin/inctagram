import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {UserRepository} from '../../db.providers/user/user.repository';
import {EmailManager} from '../../../../../libs/adapters/email.adapter';
import {ViewUser} from '../../view-model/user.view-model';
import {NewUser} from '../../entities/new-user.entity';
import {EmailConfirmation} from '../../entities/email-confirmation.entity';
import {EmailDto} from "../../../auth/dto/email.dto";
import {TRegistrationViaThirdPartyServices} from "../../../auth/dto/registration-via-third-party-services.dto";
import {WithClientMeta} from "../../../auth/dto/session-id.dto";
import {randomUUID} from "crypto";
import {TokensFactory} from "../../../../../libs/shared/tokens.factory";
import {ok} from "assert";

export class MergeProfileCommand {
  constructor(public readonly dto: WithClientMeta<EmailDto>) {}
}

@CommandHandler(MergeProfileCommand)
export class MergeProfileCommandHandler
  implements ICommandHandler<MergeProfileCommand, TRegistrationViaThirdPartyServices>
{
  constructor(
      private factory: TokensFactory,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ dto }: MergeProfileCommand): Promise<TRegistrationViaThirdPartyServices | null> {
    const deviceId = randomUUID()
    const createdUser = await this.userRepository.mergeUserProfile(
      dto,
        deviceId
    );
    console.log({createdUser})
    const tokens = await this.factory.getPairTokens(createdUser.id, deviceId);
    console.log({tokens})
    const viewUser = await ViewUser.toView(createdUser);
    console.log({viewUser})
    return { user: viewUser, ...tokens };
  }
}
