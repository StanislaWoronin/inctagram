import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';

@Injectable()
export class AvatarRepository {
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

  async saveAvatar(userId: string, photoLink: string): Promise<boolean> {
    const result = await this.prisma.avatar.create({
      data: {
        userId,
        photoLink,
      },
    });

    return typeof result !== null;
  }
}
