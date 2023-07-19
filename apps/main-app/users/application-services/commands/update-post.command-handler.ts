import { UserIdWith } from '../../dto/user-with.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user/user.repository';
import { UpdatePostDto } from '../../dto/update-post.dto';

export class UpdatePostCommand {
  constructor(public readonly dto: UserIdWith<UpdatePostDto>) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostCommand, boolean>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ dto }: UpdatePostCommand): Promise<boolean> {
    return await this.userRepository.updatePost(dto);
  }
}
