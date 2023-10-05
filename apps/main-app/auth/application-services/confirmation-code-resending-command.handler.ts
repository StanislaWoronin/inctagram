import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../users/db.providers/users/user.query-repository';
import { EmailManager } from '../../../../libs/adapters/email.adapter';
import { settings } from '../../../../libs/shared/settings';
import { ProfileRepository } from '../../users/db.providers/profile/profile.repository';
import { WithClientMeta } from '../dto/session-id.dto';
import { EmailDto } from '../dto/email.dto';

export class ConfirmationCodeResendingCommand {
  constructor(public readonly dto: WithClientMeta<EmailDto>) {}
}

@CommandHandler(ConfirmationCodeResendingCommand)
export class ConfirmationCodeResendingCommandHandler
  implements ICommandHandler<ConfirmationCodeResendingCommand, boolean>
{
  constructor(
    private profileRepository: ProfileRepository,
    private userQueryRepository: UserQueryRepository,
    private emailManger: EmailManager,
  ) {}

  async execute({ dto }: ConfirmationCodeResendingCommand): Promise<boolean> {
    const user = await this.userQueryRepository.getUserByField(dto.email);
    const newEmailConfirmationCode = (
      Date.now() + settings.timeLife.CONFIRMATION_CODE
    ).toString();
    await this.profileRepository.updateEmailConfirmationCode(
      user.id,
      newEmailConfirmationCode,
    );

    await this.emailManger.sendConfirmationEmail(
      dto.email,
      newEmailConfirmationCode,
      dto.language,
    );
    return true;
  }
}
