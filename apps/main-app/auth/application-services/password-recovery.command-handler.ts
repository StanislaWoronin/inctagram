import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../users/db.providers/users/user.query-repository';
import { UserRepository } from '../../users/db.providers/users/user.repository';
import { EmailManager } from '../../../../libs/adapters/email.adapter';
import { PasswordRecovery } from '../../users/entities/password-recovery.entity';
import { ProfileRepository } from '../../users/db.providers/profile/profile.repository';
import { WithClientMeta } from '../dto/session-id.dto';
import { EmailDto } from '../dto/email.dto';

export class PasswordRecoveryCommand {
  constructor(public readonly dto: WithClientMeta<EmailDto>) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCommandHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private profileRepository: ProfileRepository,
    private userQueryRepository: UserQueryRepository,
    private emailManger: EmailManager,
  ) {}

  async execute({ dto }: PasswordRecoveryCommand): Promise<boolean> {
    const user = await this.userQueryRepository.getUserByField(dto.email);
    if (user) {
      const passwordRecovery = PasswordRecovery.create(user.id);
      const isSuccess = await this.profileRepository.setPasswordRecovery(
        passwordRecovery,
      );
      if (isSuccess)
        await this.emailManger.sendPasswordRecoveryEmail(
          dto.email,
          passwordRecovery.passwordRecoveryCode,
          dto.language,
        );
    }
    return true;
  }
}
