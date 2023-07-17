import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user/user.repository';
import { UserQueryRepository } from '../../db.providers/user/user-query.repository';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserProfileDto } from '../../dto/update-user.dto';

export class UpdateUserProfileCommand {
  constructor(
    public readonly dto: UpdateUserProfileDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileCommandHandler
  implements ICommandHandler<UpdateUserProfileCommand>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId, dto }: UpdateUserProfileCommand): Promise<boolean> {
    return await this.userRepository.updateUserProfile(userId, dto);
  }
}
