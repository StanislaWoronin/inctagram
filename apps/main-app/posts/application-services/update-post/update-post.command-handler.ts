import { UserIdWith } from '../../../users/dto/id-with.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../users/db.providers/users/user.repository';
import { UpdatePostDto } from '../../../users/dto/update-post.dto';
import { PostRepository } from '../../../users/db.providers/images/post.repository';

export class UpdatePostCommand {
  constructor(public readonly dto: UserIdWith<UpdatePostDto>) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler
  implements ICommandHandler<UpdatePostCommand, boolean>
{
  constructor(private readonly postRepository: PostRepository) {}

  async execute({ dto }: UpdatePostCommand): Promise<boolean> {
    return await this.postRepository.updatePost(dto);
  }
}
