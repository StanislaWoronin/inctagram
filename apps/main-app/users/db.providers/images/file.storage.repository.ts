import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { PhotoType } from '../../../../../libs/shared/enums/photo-type.enum';

@Injectable()
export class FileStorageRepository {
  constructor(private prisma: PrismaService) {}

  async createImage(data): Promise<boolean> {
    const result = await this.prisma.photos.create({ data });
    return typeof result !== null;
  }

  async deleteOldAvatar(userId: string): Promise<boolean> {
    const result = await this.prisma.photos.deleteMany({
      where: {
        userId,
        photoType: PhotoType.Avatar,
      },
    });

    return typeof result !== null;
  }

  async saveImage(
    userId: string,
    photoType: PhotoType,
    photoLink: string,
  ): Promise<boolean> {
    const result = await this.prisma.photos.create({
      data: {
        userId,
        photoType,
        photoLink,
      },
    });

    return typeof result !== null;
  }
}
