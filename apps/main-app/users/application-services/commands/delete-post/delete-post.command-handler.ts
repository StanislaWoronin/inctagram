import { PostIdWith } from '../../../dto/id-with.dto';
import { DeletePostDto } from '../../../dto/delete-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Role } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { PostRepository } from '../../../db.providers/images/post.repository';
import { PostQueryRepository } from '../../../db.providers/images/post.query-repository';

export class DeletePostCommand {
  constructor(public readonly dto: PostIdWith<DeletePostDto>) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler
  implements ICommandHandler<DeletePostCommand, boolean>
{
  constructor(
    private postRepository: PostRepository,
    private postQueryRepository: PostQueryRepository,
  ) {}

  async execute({ dto }: DeletePostCommand): Promise<boolean> {
    const postExist = await this.postQueryRepository.getPostById(dto.postId);
    if (!postExist) throw new NotFoundException();
    if (postExist.isDeleted === dto.isDeleted) return true;

    if (dto.isDeleted) {
      await this.postRepository.createReasonDeletingPost(dto.postId, Role.USER);
    } else {
      await this.postRepository.deleteReasonDeletingPost(dto.postId);
    }

    return await this.postRepository.updateDeleteStatus(dto);
  }
}
