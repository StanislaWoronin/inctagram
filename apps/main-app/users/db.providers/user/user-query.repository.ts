import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { ViewUser } from '../../view-model/user.view-model';
import { Device, Photos, User } from '@prisma/client';
import { ViewUserWithInfo } from '../../view-model/user-with-info.view-model';
import { tr } from '@faker-js/faker';
import { log } from 'util';
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

  async getUserWithPrivateField(value: string): Promise<{
    id: string;
    isConfirmed: boolean;
    passwordHash: string;
  } | null> {
    return this.prisma.user.findFirst({
      select: {
        id: true,
        passwordHash: true,
        isConfirmed: true,
      },
      where: {
        email: value,
      },
    });
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

  async getViewUserWithInfo(userId: string): Promise<ViewUserWithInfo> {
    const user = await this.prisma.user.findFirst({
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

    return ViewUserWithInfo.toView(user);
  }
}
