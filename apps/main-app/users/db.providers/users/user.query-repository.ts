import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { TExtendsViewUser, ViewUser } from '../../view-model/user.view-model';
import { settings } from '../../../../../libs/shared/settings';
import { FullUser } from '../../../../../test/types/full-user.type';

@Injectable()
export class UserQueryRepository {
  constructor(private prisma: PrismaService) {}

  async getUserByField(
    value: string,
  ): Promise<(ViewUser & { isConfirmed: boolean }) | null> {
    return this.prisma.user.findFirst({
      select: {
        id: true,
        userName: true,
        email: true,
        createdAt: true,
        isConfirmed: true,
      },
      where: {
        OR: [{ id: value }, { email: value }, { userName: value }],
      },
    });
  }

  async getUserByDeviceId(userId: string, deviceId: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      select: { id: true },
      where: {
        id: userId,
        Device: {
          some: {
            deviceId: deviceId,
          },
        },
      },
    });

    return !!user;
  }

  async getUserWithPrivateField(
    value: string,
  ): Promise<TExtendsViewUser | null> {
    return await this.prisma.user.findFirst({
      select: {
        id: true,
        userName: true,
        email: true,
        createdAt: true,
        passwordHash: true,
        isConfirmed: true,
      },
      where: {
        email: value,
      },
    });
  }

  async getLastClientName(): Promise<string | null> {
    const latestClient = await this.prisma.user.findFirst({
      where: {
        userName: {
          startsWith: settings.clientName,
        },
      },
      select: {
        userName: true,
      },
      orderBy: {
        userName: 'desc',
      },
      take: 1,
    });

    return latestClient?.userName || null;
  }

  async getViewUserWithInfo(userId: string): Promise<Partial<FullUser>> {
    return await this.prisma.user.findFirst({
      select: {
        id: true,
        userName: true,
        email: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        birthday: true,
        city: true,
        aboutMe: true,
        Avatar: {
          select: {
            photoLink: true,
          },
        },
      },
      where: {
        id: userId,
      },
    });
  }
}
