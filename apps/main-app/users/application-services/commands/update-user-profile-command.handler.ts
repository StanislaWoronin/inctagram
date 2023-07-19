import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user/user.repository';
import { UserQueryRepository } from '../../db.providers/user/user-query.repository';
import { BadRequestException } from '@nestjs/common';
import { UpdateUserProfileDto } from '../../dto/update-user.dto';
import { UserIdWith } from '../../dto/id-with.dto';

export class UpdateUserProfileCommand {
  constructor(public readonly dto: UserIdWith<UpdateUserProfileDto>) {}
}

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileCommandHandler
  implements ICommandHandler<UpdateUserProfileCommand, boolean>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ dto }: UpdateUserProfileCommand): Promise<boolean> {
    return await this.userRepository.updateUserProfile(dto);
  }
}
