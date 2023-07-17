import { RegistrationDto } from '../../../auth/dto/registration.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user/user.repository';
import { EmailManager } from '../../../../../libs/adapters/email.adapter';
import { ViewUser } from '../../view-model/user.view-model';
import { NewUser } from '../../entities/new-user.entity';
import { EmailConfirmation } from '../../entities/email-confirmation.entity';

export class MergeProfileCommand {
  constructor(public readonly dto: RegistrationDto) {}
}

@CommandHandler(MergeProfileCommand)
export class MergeProfileCommandHandler
  implements ICommandHandler<MergeProfileCommand, ViewUser>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailManager: EmailManager,
  ) {}

  async execute({ dto }: MergeProfileCommand): Promise<ViewUser | null> {
    const newUser = await NewUser.create(dto);
    const emailConfirmation = await EmailConfirmation.create();
    const createdUser = await this.userRepository.mergeUserProfile(
      newUser,
      emailConfirmation,
    );
    await this.emailManager.sendConfirmationEmail(
      createdUser.email,
      emailConfirmation.confirmationCode,
    );
    return await ViewUser.create(createdUser);
  }
}
