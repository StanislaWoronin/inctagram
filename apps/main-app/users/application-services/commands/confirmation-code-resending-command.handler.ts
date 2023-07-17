import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user/user-query.repository';
import { UserRepository } from '../../db.providers/user/user.repository';
import { EmailManager } from '../../../../../libs/adapters/email.adapter';
import { settings } from '../../../../../libs/shared/settings';

export class ConfirmationCodeResendingCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ConfirmationCodeResendingCommand)
export class ConfirmationCodeResendingCommandHandler
  implements ICommandHandler<ConfirmationCodeResendingCommand, boolean>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private emailManger: EmailManager,
  ) {}

  async execute(command: ConfirmationCodeResendingCommand): Promise<boolean> {
    const user = await this.userQueryRepository.getUserByField(command.email);
    const newEmailConfirmationCode = (
      Date.now() + settings.timeLife.CONFIRMATION_CODE
    ).toString();
    await this.userRepository.updateEmailConfirmationCode(
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
