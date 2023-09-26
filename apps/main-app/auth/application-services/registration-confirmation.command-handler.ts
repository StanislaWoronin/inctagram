import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../users/db.providers/users/user.query-repository';
import { UserRepository } from '../../users/db.providers/users/user.repository';
import { BadRequestException } from '@nestjs/common';
import {
  RegistrationConfirmationResponse,
  RegistrationConfirmationView,
} from '../view-model/registration-confirmation.response';
import { ProfileQueryRepository } from '../../users/db.providers/profile/profile.query-repository';

export class RegistrationConfirmationCommand {
  constructor(public readonly confirmationCode: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationCommandHandler
  implements
    ICommandHandler<
      RegistrationConfirmationCommand,
      RegistrationConfirmationView
    >
{
  constructor(
    private userRepository: UserRepository,
    private profileQueryRepository: ProfileQueryRepository,
  ) {}

  async execute({
    confirmationCode,
  }: RegistrationConfirmationCommand): Promise<RegistrationConfirmationView> {
    const user = await this.profileQueryRepository.getUserByConfirmationCode(
      confirmationCode,
    );
    if (!user)
      throw new BadRequestException(
        `confirmationCode:Incorrect confirmationCode.`,
      );
    if (user.isConfirmed)
      return RegistrationConfirmationView.toView(
        RegistrationConfirmationResponse.Confirm,
      );
    if (Number(confirmationCode) < Date.now())
      return RegistrationConfirmationView.toView(
        RegistrationConfirmationResponse.Invalid,
        user.email,
      );

    await this.userRepository.updateUserConfirmationStatus(user.id);
    return RegistrationConfirmationView.toView(
      RegistrationConfirmationResponse.Success,
    );
  }
}
