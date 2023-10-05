import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { PostIdWith, UserIdWith } from '../../dto/id-with.dto';
import { DeletePostDto } from '../../dto/delete-post.dto';
import { CreatedPostView } from '../../view-model/created-post.view-model';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { settings } from '../../../../../libs/shared/settings';

@Injectable()
export class PostRepository {
  constructor(private prisma: PrismaService) {}

  async savePost(
    userId: string,
    description: string,
    postImagesLink: string[],
  ): Promise<CreatedPostView> {
    const createdPost = await this.prisma.posts.create({
      data: {
        userId,
        description,
        createdAt: new Date().toISOString(),
        Photos: {
          create: postImagesLink.map((photoLink) => ({
            photoLink,
          })),
        },
      },
      include: {
        Photos: true,
      },
    });

    return CreatedPostView.toView(createdPost);
  }

  async updatePost(dto: UserIdWith<UpdatePostDto>): Promise<boolean> {
    const result = await this.prisma.posts.update({
      where: { id: dto.postId },
      data: {
        description: dto.description,
      },
    });

    return typeof result !== null;
  }

  async createReasonDeletingPost(postId: string, role: Role): Promise<boolean> {
    const result = await this.prisma.deletedPosts.create({
      data: {
        posts: {
          connect: {
            id: postId,
          },
        },
        deleteAt: (Date.now() + settings.timeLife.deletedPost).toString(),
        deleteBy: role,
      },
    });

    return typeof result !== null;
  }

  async deleteReasonDeletingPost(postId: string): Promise<boolean> {
    const result = await this.prisma.deletedPosts.delete({
      where: { postId },
    });

    return typeof result !== null;
  }

  async updateDeleteStatus(dto: PostIdWith<DeletePostDto>): Promise<boolean> {
    const result = await this.prisma.posts.update({
      where: { id: dto.postId },
      data: {
        isDeleted: dto.isDeleted,
      },
    });

    return typeof result !== null;
  }
}
