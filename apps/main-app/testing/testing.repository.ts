import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from '../../../libs/shared/enums/tokens.enum';
import { settings } from '../../../libs/shared/settings';
import { FullUser } from '../../../test/types/full-user.type';
import { decodeBirthday } from '../../../libs/shared/helpers';
import { Prisma } from '@prisma/client';

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

    return Promise.all(
      tables.map((table) => this.prisma[table].deleteMany({})),
    );
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

  async createTestingPost(dto) {
    return await this.prisma.user.create({
      data: {
        userName: dto.userName,
        email: dto.email,
        createdAt: dto.createdAt,
        isConfirmed: true,
        Posts: {
          create: {
            description: dto.description,
            Photos: {
              create: dto.postImagesLink.map((photoLink) => ({
                photoLink,
              })),
            },
          },
        },
      },
      select: {
        id: true,
        Posts: {
          select: {
            id: true,
            description: true,
            Photos: {
              select: {
                photoLink: true,
              },
            },
          },
        },
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

  async makeEmailConfirmationExpired(
    userId: string,
    confirmationCode: string,
  ): Promise<string> {
    const expiredCode = (
      Number(confirmationCode) - settings.timeLife.CONFIRMATION_CODE
    ).toString();
    await this.prisma.emailConfirmation.update({
      where: { userId },
      data: { confirmationCode: expiredCode },
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
    await this.prisma.emailConfirmation.update({
      where: { userId },
      data: { confirmationCode: expiredCode },
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

  // async createImage(photoType: PhotoType, color: string, format: keyof FormatEnum | AvailableFormatInfo) {
  //   const imagePath = join(
  //       __dirname,
  //       '..',
  //       'images',
  //       photoType,
  //       new Date().toLocaleString()
  //   );
  //
  //   return await sharp({
  //     create: {
  //       width: 600,
  //       height: 600,
  //       channels: 3,
  //       background: color,
  //     }
  //   })
  //       .toFormat(format)
  //       .toFile(imagePath);
  // }
}
