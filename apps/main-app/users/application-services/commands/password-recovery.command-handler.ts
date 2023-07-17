import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user/user-query.repository';
import { UserRepository } from '../../db.providers/user/user.repository';
import { EmailManager } from '../../../../../libs/adapters/email.adapter';
import { PasswordRecovery } from '../../entities/password-recovery.entity';

export class PasswordRecoveryCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCommandHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private emailManger: EmailManager,
  ) {}

  async execute({ email }: PasswordRecoveryCommand): Promise<boolean> {
    const user = await this.userQueryRepository.getUserByField(email);
    if (user) {
      const passwordRecovery = PasswordRecovery.create(user.id);
      const isSuccess = await this.userRepository.setPasswordRecovery(
        passwordRecovery,
      );
      if (isSuccess)
        await this.emailManger.sendPasswordRecoveryEmail(
          email,
          passwordRecovery.passwordRecoveryCode,
        );
    }
    return true;
  }
}
