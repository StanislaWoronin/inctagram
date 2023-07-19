import { Injectable } from '@nestjs/common';
import { Device, EmailConfirmation, Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { PasswordRecovery } from '../../entities/password-recovery.entity';
import { UpdateUserProfileDto } from '../../dto/update-user.dto';
import { PostIdWith, UserIdWith } from '../../dto/id-with.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';
import { DeletePostDto } from '../../dto/delete-post.dto';

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

  async createReasonDeletingPost(postId: string, role: Role): Promise<boolean> {
    const result = await this.prisma.deletedPosts.create({
      data: {
        postId,
        deleteAt: Date.now().toString(),
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

  async mergeUserProfile(
    user: Prisma.UserCreateInput,
    emailConfirmation: EmailConfirmation,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { email: user.email },
      data: {
        userName: user.userName,
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

  async createUserDevice(device: Device): Promise<Device> {
    const result = await this.prisma.device.create({
      data: {
        deviceId: device.deviceId,
        ipAddress: device.ipAddress,
        title: device.title,
        createdAt: device.createdAt,
        userId: device.userId,
      },
    });

    return result;
  }

  async removeDeviceId(deviceId: string): Promise<boolean> {
    const result = await this.prisma.device.delete({
      where: {
        deviceId,
      },
    });

    return typeof result !== null;
  }

  async setPasswordRecovery(
    passwordRecovery: PasswordRecovery,
  ): Promise<boolean> {
    const result = await this.prisma.passwordRecovery.upsert({
      where: {
        userId: passwordRecovery.userId,
      },
      update: { passwordRecoveryCode: passwordRecovery.passwordRecoveryCode },
      create: {
        userId: passwordRecovery.userId,
        passwordRecoveryCode: passwordRecovery.passwordRecoveryCode,
      },
    });

    return typeof result !== null;
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

  async updateEmailConfirmationCode(
    userId: string,
    confirmationCode: string,
  ): Promise<boolean> {
    const result = await this.prisma.emailConfirmation.update({
      where: { userId },
      data: { confirmationCode },
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
    const result = await this.prisma.user.delete({ where: { id } });
    return typeof result !== null;
  }
}
