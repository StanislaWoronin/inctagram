import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { PhotoType } from '../../../libs/shared/enums/photo-type.enum';

@Injectable()
export class FileStorageRepository {
  constructor(private prisma: PrismaService) {}

  async createImage(data): Promise<boolean> {
    const result = await this.prisma.photos.create({ data });
    return typeof result !== null;
  }

  async updateImage(id: string, photoLink: string): Promise<boolean> {
    const result = await this.prisma.photos.update({
      where: { id: id },
      data: {
        photoLink: photoLink,
      },
    });

    return typeof result !== null;
  }
}
