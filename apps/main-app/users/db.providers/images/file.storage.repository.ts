import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { CreatedPostView } from '../../view-model/created-post.view-model';

@Injectable()
export class FileStorageRepository {
  constructor(private prisma: PrismaService) {}

  async deleteOldAvatar(userId: string): Promise<boolean> {
    try {
      await this.prisma.avatar.delete({
        where: {
          userId,
        },
      });
      return true;
    } catch (e) {
      // If the entry is not found, it will throw an error.
      return false;
    }
  }

  async saveImage(userId: string, photoLink: string): Promise<boolean> {
    const result = await this.prisma.avatar.create({
      data: {
        userId,
        photoLink,
      },
    });

    return typeof result !== null;
  }

  async savePost(
    userId: string,
    description: string,
    postImagesLink: string[],
  ): Promise<CreatedPostView> {
    const createdPost = await this.prisma.posts.create({
      data: {
        userId,
        description,
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
}
