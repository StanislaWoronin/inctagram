import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../users/db.providers/users/user.repository';
import { UserQueryRepository } from '../../users/db.providers/users/user.query-repository';
import bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { NewPasswordDto } from '../dto/new-password.dto';
import { ProfileQueryRepository } from '../../users/db.providers/profile/profile.query-repository';

export class UpdatePasswordCommand {
  constructor(public readonly dto: NewPasswordDto) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordCommandHandler
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private userRepository: UserRepository,
    private profileQueryRepository: ProfileQueryRepository,
  ) {}

  async execute({ dto }: UpdatePasswordCommand): Promise<boolean> {
    const { newPassword, passwordRecoveryCode } = dto;

    const user = await this.profileQueryRepository.getUserByRecoveryCode(
      passwordRecoveryCode,
    );

    const passwordEqual = await bcrypt.compare(newPassword, user.passwordHash);
    if (passwordEqual) {
      throw new BadRequestException(`newPassword:New password to equal old.`);
    }

    const hash = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.updateUserPassword(user.id, hash);
  }
}
