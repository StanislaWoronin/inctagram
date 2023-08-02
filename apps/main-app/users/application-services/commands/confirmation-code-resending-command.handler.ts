import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/users/user.query-repository';
import { EmailManager } from '../../../../../libs/adapters/email.adapter';
import { settings } from '../../../../../libs/shared/settings';
import { ProfileRepository } from '../../db.providers/profile/profile.repository';

export class ConfirmationCodeResendingCommand {
  constructor(public readonly email: string) {}
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

  async execute(command: ConfirmationCodeResendingCommand): Promise<boolean> {
    const user = await this.userQueryRepository.getUserByField(command.email);
    const newEmailConfirmationCode = (
      Date.now() + settings.timeLife.CONFIRMATION_CODE
    ).toString();
    await this.profileRepository.updateEmailConfirmationCode(
      user.id,
      newEmailConfirmationCode,
    );

    await this.emailManger.sendConfirmationEmail(
      command.email,
      newEmailConfirmationCode,
    );
    return true;
  }
}
