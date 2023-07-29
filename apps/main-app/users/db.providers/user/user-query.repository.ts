import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { TExtendsViewUser, ViewUser } from '../../view-model/user.view-model';
import { Device, Posts, User } from '@prisma/client';
import { UserIdWith } from '../../dto/id-with.dto';
import { MyPostQuery } from '../../dto/my-post.query';
import { MyPostsView } from '../../view-model/my-posts.view-model';
import { settings } from '../../../../../libs/shared/settings';
import { FullUser } from '../../../../../test/types/full-user.type';

@Injectable()
export class UserQueryRepository {
  constructor(private prisma: PrismaService) {}

  async getPostById(postId): Promise<Posts> {
    return await this.prisma.posts.findUnique({ where: { id: postId } });
  }

  async getMyPosts(dto: UserIdWith<MyPostQuery>): Promise<MyPostsView> {
    const userPosts = await this.prisma.user.findUnique({
      select: {
        id: true,
        userName: true,
        aboutMe: true,
        Avatar: {
          select: {
            photoLink: true,
          },
        },
        Posts: {
          select: {
            id: true,
            createdAt: true,
            Photos: {
              select: {
                photoLink: true,
              },
            },
          },
          where: {
            isDeleted: false,
          },
          orderBy: { createdAt: 'desc' },
          skip: dto.skip,
          take: settings.pagination.pageSize,
        },
      },
      where: {
        id: dto.userId,
      },
    });

    const totalCount = await this.prisma.posts.count({
      where: {
        userId: dto.userId,
        isDeleted: false,
      },
    });

    return MyPostsView.toView(userPosts, dto.page, totalCount);
  }

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

  async getUserDevice(userId: string, deviceId: string): Promise<Device> {
    return this.prisma.device.findFirst({
      where: {
        AND: [{ userId }, { deviceId }],
      },
    });
  }

  async getUserByConfirmationCode(
    code: string,
  ): Promise<(ViewUser & { isConfirmed: boolean }) | null> {
    const result = await this.prisma.emailConfirmation.findFirst({
      where: {
        confirmationCode: code,
      },
    });
    if (!result) {
      return null;
    } else {
      const { user } = await this.prisma.emailConfirmation.findFirst({
        where: {
          confirmationCode: code,
        },
        include: {
          user: {
            select: {
              id: true,
              userName: true,
              email: true,
              createdAt: true,
              isConfirmed: true,
            },
          },
        },
      });
      return user;
    }
  }

  async getUserByRecoveryCode(code: string): Promise<User | null> {
    const result = await this.prisma.passwordRecovery.findFirst({
      where: {
        passwordRecoveryCode: code,
      },
    });
    if (!result) {
      return null;
    } else {
      const { user } = await this.prisma.passwordRecovery.findFirst({
        where: {
          passwordRecoveryCode: code,
        },
        include: { user: true },
      });
      return user;
    }
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
