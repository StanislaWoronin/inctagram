import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user.repository';
import { UserQueryRepository } from '../../db.providers/user-query.repository';
import bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { NewPasswordDto } from '../../../auth/dto/new-password.dto';

export class UpdatePasswordCommand {
  constructor(public readonly dto: NewPasswordDto) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordCommandHandler
  implements ICommandHandler<UpdatePasswordCommand>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute({ dto }: UpdatePasswordCommand): Promise<boolean> {
    const { newPassword, passwordRecoveryCode } = dto;

    const user = await this.userQueryRepository.getUserByRecoveryCode(
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
