import { Injectable } from '@nestjs/common';
import { EmailConfirmation, Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { UpdateUserProfileDto } from '../../dto/update-user.dto';
import { UserIdWith } from '../../dto/id-with.dto';
import { WithClientMeta } from '../../../auth/dto/session-id.dto';
import { EmailDto } from '../../../auth/dto/email.dto';
import { GoogleUserDto } from '../../../auth/dto/google-user.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(
    user: Prisma.UserCreateInput,
    emailConfirmation: EmailConfirmation,
  ): Promise<User> {
    return await this.prisma.user.create({
      data: {
        userName: user.userName,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
        EmailConfirmation: {
          create: {
            confirmationCode: emailConfirmation.confirmationCode,
          },
        },
      },
    });
  }

  async createUserViaThirdPartyServices({
    id,
    user,
    photoLink,
    deviceId,
    clientMeta,
  }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          id,
          userName: user.userName,
          email: user.email,
          createdAt: user.createdAt,
          isConfirmed: user.isConfirmed,
          Avatar: {
            create: {
              photoLink,
            },
          },
          Device: {
            create: {
              deviceId,
              ipAddress: clientMeta.ipAddress,
              title: clientMeta.ipAddress,
              createdAt: new Date().toISOString(),
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async mergeUserProfile(
    dto: WithClientMeta<EmailDto>,
    deviceId: string,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { email: dto.email },
      data: {
        createdAt: new Date().toISOString(),
        isConfirmed: true,
        Device: {
          create: {
            deviceId,
            ipAddress: dto.clientMeta.ipAddress,
            title: dto.clientMeta.title,
            createdAt: new Date().toISOString(),
          },
        },
      },
    });
  }

  async updateUserPassword(
    userId: string,
    passwordHash: string,
  ): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return typeof result !== null;
  }

  async updateUserConfirmationStatus(userId: string): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: { id: userId },
      data: { isConfirmed: true },
    });

    return typeof result !== null;
  }

  async updateUserProfile(
    dto: UserIdWith<UpdateUserProfileDto>,
  ): Promise<boolean> {
    const result = await this.prisma.user.update({
      where: { id: dto.userId },
      data: {
        userName: dto.userName,
        firstName: dto.firstName,
        lastName: dto.lastName,
        birthday: dto.birthday,
        city: dto.city,
        aboutMe: dto.aboutMe,
      },
    });
    return typeof result !== null;
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.prisma.user.delete({ where: { id } });
      return typeof result !== null;
    } catch (e) {
      return false;
    }
  }
}
