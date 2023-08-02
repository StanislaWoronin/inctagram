import { Injectable } from '@nestjs/common';
import { PrismaService } from '../providers/prisma/prisma.service';
import { settings } from '../shared/settings';

@Injectable()
export class TaskRepository {
  constructor(private prisma: PrismaService) {}

  async clearEmailConfirmation(): Promise<void> {
    await this.prisma.emailConfirmation.deleteMany({
      where: {
        confirmationCode: { lte: String(Date.now()) },
      },
    });
    return;
  }

  async clearPasswordRecovery(): Promise<void> {
    await this.prisma.passwordRecovery.deleteMany({
      where: {
        passwordRecoveryCode: { lte: String(Date.now()) },
      },
    });
    return;
  }

  async deleteDepricatedPost(): Promise<void> {
    const deleteDate = Date.now() - settings.timeLife.deletedPost;

    const depricatedPosts = await this.prisma.deletedPosts.findMany({
      where: { deleteAt: { lte: String(deleteDate) } },
      select: { postId: true },
    });
    const postsId = depricatedPosts.map((postId) => postsId.push(postId));

    const deletePost = this.prisma.posts.deleteMany({
      where: {
        id: {
          in: postsId,
        },
      },
    });

    const removeDeletePostInfo = this.prisma.deletedPosts.deleteMany({
      where: {
        postId: {
          in: postsId,
        },
      },
    });

    const deletePostPhotos = this.prisma.photos.deleteMany({
      where: {
        postId: {
          in: postsId,
        },
      },
    });

    await this.prisma.$transaction([
      postsId,
      deletePost,
      removeDeletePostInfo,
      deletePostPhotos,
    ]);
    return;
  }
}
