import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../../libs/providers/prisma/prisma.service';
import {JwtService} from '@nestjs/jwt';
import {Tokens} from '../../../libs/shared/enums/tokens.enum';
import {settings} from '../../../libs/shared/settings';
import {FullUser} from '../../../test/types/full-user.type';

@Injectable()
export class TestingRepository {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async deleteAll() {
    await this.prisma.device.deleteMany({});
    await this.prisma.emailConfirmation.deleteMany({});
    await this.prisma.passwordRecovery.deleteMany({});
    await this.prisma.user.deleteMany({});
    await this.prisma.photos.deleteMany({});
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
        Photos: true
      },
    });
    let birthday = null;
    if (user.birthday) {
      const [mm, dd, yyyy] = new Date(user.birthday)
        .toLocaleDateString()
        .split('.');
      birthday = `${dd}.${mm}.${yyyy}`;
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
