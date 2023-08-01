import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/users/user.query-repository';
import { UserRepository } from '../../db.providers/users/user.repository';
import { BadRequestException } from '@nestjs/common';
import { RegistrationConfirmationResponse } from '../../../auth/view-model/registration-confirmation.response';
import {ProfileQueryRepository} from "../../db.providers/profile/profile.query-repository";

export class RegistrationConfirmationCommand {
  constructor(public readonly confirmationCode: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationCommandHandler
  implements ICommandHandler<RegistrationConfirmationCommand, string>
{
  constructor(
    private userRepository: UserRepository,
    private profileQueryRepository: ProfileQueryRepository,
  ) {}

  async execute({
    confirmationCode,
  }: RegistrationConfirmationCommand): Promise<string> {
    const user = await this.profileQueryRepository.getUserByConfirmationCode(
      confirmationCode,
    );
    if (!user)
      throw new BadRequestException(
        `confirmationCode:Incorrect confirmationCode.`,
      );
    if (user.isConfirmed) return RegistrationConfirmationResponse.Confirm;
    if (Number(confirmationCode) < Date.now()) return user.email;

    await this.userRepository.updateUserConfirmationStatus(user.id);
    return RegistrationConfirmationResponse.Success;
  }
}
