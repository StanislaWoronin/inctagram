import { PostIdWith } from '../../../dto/id-with.dto';
import { DeletePostDto } from '../../../dto/delete-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../db.providers/user/user.repository';
import { Role } from '@prisma/client';
import { UserQueryRepository } from '../../../db.providers/user/user-query.repository';
import { NotFoundException } from '@nestjs/common';

export class DeletePostCommand {
  constructor(public readonly dto: PostIdWith<DeletePostDto>) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand, boolean>
{
  constructor(
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async execute({ dto }: DeletePostCommand): Promise<boolean> {
    const postExist = await this.userQueryRepository.getPostById(dto.postId);
    if (!postExist) throw new NotFoundException();
    if (postExist.isDeleted === dto.isDeleted) return true;

    if (dto.isDeleted) {
      await this.userRepository.createReasonDeletingPost(dto.postId, Role.USER);
    } else {
      await this.userRepository.deleteReasonDeletingPost(dto.postId);
    }

    return await this.userRepository.updateDeleteStatus(dto);
  }
}
