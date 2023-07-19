import { PostIdWith } from '../../dto/id-with.dto';
import { DeletePostDto } from '../../dto/delete-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user/user.repository';
import { Role } from '@prisma/client';

export class DeletePostCommand {
  constructor(public readonly dto: PostIdWith<DeletePostDto>) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand, boolean>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ dto }: DeletePostCommand): Promise<boolean> {
    if (dto.isDeleted) {
      console.log(dto);
      await this.userRepository.createReasonDeletingPost(dto.postId, Role.USER);
    } else {
      await this.userRepository.deleteReasonDeletingPost(dto.postId);
    }

    return await this.userRepository.updateDeleteStatus(dto);
  }
}
