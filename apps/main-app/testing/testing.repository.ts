import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../../../libs/shared/enums/tokens.enum';
import { settings } from '../../../libs/shared/settings';
import { FullUser } from '../../../test/types/full-user.type';
import { decodeBirthday } from '../../../libs/shared/helpers';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class TestingRepository {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async deleteAll() {
    const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

    const tables = modelNames.map((modelName) => {
      return modelName.replace(/(^|\s)\S/g, (a) => {
        return a.toLowerCase();
      });
    });

    for (const table of tables) await this.prisma[table].deleteMany({});
  }

  async deleteUser(data: string) {
    return this.prisma.user.deleteMany({
      where: {
        OR: [{ id: data }, { email: data }, { userName: data }],
      },
    });
  }

  async createTestingUser(dto) {
    return await this.prisma.user.create({
      data: {
        userName: dto.userName,
        email: dto.email,
        createdAt: dto.createdAt,
        isConfirmed: dto.isConfirmed,
      },
    });
  }

  async createUserWithConfirmationCode(dto) {
    return await this.prisma.user.create({
      data: {
        userName: dto.userName,
        email: dto.email,
        createdAt: dto.createdAt,
        isConfirmed: dto.isConfirmed,
        EmailConfirmation: {
          create: {
            confirmationCode: (
              dto.code + settings.timeLife.CONFIRMATION_CODE
            ).toString(),
          },
        },
        PasswordRecovery: {
          create: {
            passwordRecoveryCode: (
              dto.code + settings.timeLife.PASSWORD_RECOVERY_CODE
            ).toString(),
          },
        },
      },
    });
  }

  // async createTestingPost(dto, userCount = 1, postCount = 1) {
  //   const user = await this.prisma.user.create({
  //     data: {
  //       userName: dto.userName,
  //       email: dto.email,
  //       createdAt: dto.createdAt,
  //       isConfirmed: true,
  //     },
  //     select: { id: true },
  //   });
  //
  //   const createdPosts = [];
  //
  //   for (let i = 0; i < postCount; i++) {
  //     const createdPost = await this.prisma.posts.create({
  //       data: {
  //         user: { connect: { id: user.id } },
  //         description: dto.description,
  //         createdAt: new Date().toISOString(),
  //         Photos: {
  //           create: dto.postImagesLink.map((photoLink) => ({
  //             photoLink,
  //           })),
  //         },
  //       },
  //       select: {
  //         id: true,
  //         description: true,
  //         Photos: {
  //           select: {
  //             photoLink: true,
  //           },
  //         },
  //       },
  //     });
  //
  //     createdPosts.push(createdPost);
  //   }
  //
  //   return { id: user.id, Posts: createdPosts };
  // }

  async createTestingPost(dto, userCount = 1, postCount = 1) {
    const users = [];
    for (let i = 0; i < userCount; i++) {
      const user = await this.prisma.user.create({
        data: {
          userName: `${i}${dto.userName}`,
          email: `${i}${dto.email}`,
          createdAt: dto.createdAt,
          isConfirmed: true,
        },
        select: { id: true, userName: true },
      });

      const createdPosts = [];

      for (let j = 0; j < postCount; j++) {
        const createdPost = await this.prisma.posts.create({
          data: {
            user: { connect: { id: user.id } },
            description: dto.description,
            createdAt: new Date().toISOString(),
            Photos: {
              create: dto.postImagesLink.map((photoLink) => ({
                photoLink,
              })),
            },
          },
          select: {
            id: true,
            description: true,
            Photos: {
              select: {
                photoLink: true,
              },
            },
          },
        });

        createdPosts.push(createdPost);
      }

      users.push({ id: user.id, userName: user.userName, Posts: createdPosts });
    }

    return users;
  }

  async createExpiredReasonDeletingPost(postId: string) {
    return await this.prisma.deletedPosts.create({
      data: {
        posts: {
          connect: {
            id: postId,
          },
        },
        deleteAt: (Date.now() - settings.timeLife.deletedPost).toString(),
        deleteBy: Role.ADMIN,
      },
    });
  }

  async getPost(postId) {
    return this.prisma.posts.findUnique({
      where: { id: postId },
      select: {
        id: true,
        description: true,
        isDeleted: true,
        DeletedPosts: true,
      },
    });
  }

  async getPostCount() {
    return await this.prisma.posts.count();
  }

  async deletedPostInfoCount() {
    return await this.prisma.deletedPosts.count();
  }

  async postPhotoCount() {
    return await this.prisma.photos.count();
  }

  async getUser(userId: string): Promise<FullUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        Device: true,
        EmailConfirmation: true,
        PasswordRecovery: true,
        Avatar: true,
      },
    });
    let birthday = null;
    if (user.birthday) {
      birthday = decodeBirthday(user.birthday);
    }

    return {
      ...user,
      birthday,
    };
  }

  async getUsers() {
    return await this.prisma.user.findMany({});
  }

  async getEmailConfirmationsCount() {
    return await this.prisma.emailConfirmation.count({});
  }

  async getPasswordRecoveryCodeCount() {
    return await this.prisma.passwordRecovery.count({});
  }

  async makeEmailConfirmationExpired(
    userId: string,
    confirmationCode: string,
  ): Promise<string> {
    const expiredCode = (
      Number(confirmationCode) - settings.timeLife.CONFIRMATION_CODE
    ).toString();
    await this.prisma.emailConfirmation.upsert({
      where: { userId },
      update: { confirmationCode: expiredCode },
      create: {
        userId,
        confirmationCode,
      },
    });
    return expiredCode;
  }

  async makePasswordRecoveryExpired(
    userId: string,
    confirmationCode: string,
  ): Promise<string> {
    const expiredCode = (
      Number(confirmationCode) - settings.timeLife.PASSWORD_RECOVERY_CODE
    ).toString();
    await this.prisma.passwordRecovery.upsert({
      where: { userId },
      update: { passwordRecoveryCode: expiredCode },
      create: {
        userId,
        passwordRecoveryCode: expiredCode,
      },
    });

    return expiredCode;
  }

  async makeTokenExpired(token: string, tokenType: Tokens) {
    const tokenPayload: any = await this.jwtService.decode(token);

    return this.jwtService.signAsync(
      {
        id: tokenPayload.id,
        deviceId: tokenPayload.deviceId,
      },
      {
        secret: settings.secret[tokenType],
        expiresIn: 0,
      },
    );
  }
}
