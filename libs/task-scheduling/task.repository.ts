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

  async deleteDeprecatedPost() {
    const deleteDate = Date.now() - settings.timeLife.deletedPost;
    const deprecatedPosts = await this.prisma.posts.findMany({
      where: {
        isDeleted: true,
        DeletedPosts: {
          deleteAt: {
            lte: deleteDate.toString(),
          },
        },
      },
      select: { id: true },
    });

    const postsId = deprecatedPosts.map((post) => post.id);
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

    return await this.prisma.$transaction([
      deletePost,
      removeDeletePostInfo,
      deletePostPhotos,
    ]);
  }
}
