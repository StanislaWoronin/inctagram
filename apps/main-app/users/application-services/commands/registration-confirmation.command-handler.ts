import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user/user-query.repository';
import { UserRepository } from '../../db.providers/user/user.repository';
import { BadRequestException } from '@nestjs/common';
import { RegistrationConfirmationResponse } from '../../../auth/view-model/registration-confirmation.response';

export class RegistrationConfirmationCommand {
  constructor(public readonly confirmationCode: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationCommandHandler
  implements ICommandHandler<RegistrationConfirmationCommand, string>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute({
    confirmationCode,
  }: RegistrationConfirmationCommand): Promise<string> {
    const user = await this.userQueryRepository.getUserByConfirmationCode(
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
