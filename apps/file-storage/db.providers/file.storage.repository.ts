import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { PhotoType } from '../../../libs/shared/enums/photo-type.enum';

@Injectable()
export class FileStorageRepository {
  constructor(private prisma: PrismaService) {}

  async createMainImage(data: Prisma.PhotosCreateInput): Promise<boolean> {
    const result = await this.prisma.photos.create({ data });
    return typeof result !== null;
  }

  async updateMainImage(
    userId: string,
    photoType: PhotoType,
    data: Prisma.PhotosUpdateInput,
  ): Promise<boolean> {
    const result = await this.prisma.photos.updateMany({
      data,
      where: {
        userId,
        photoType,
      },
    });

    return typeof result !== null;
  }
}
