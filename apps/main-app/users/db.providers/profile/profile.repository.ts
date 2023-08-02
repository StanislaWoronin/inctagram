import { Injectable } from '@nestjs/common';
import { Device } from '@prisma/client';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { PasswordRecovery } from '../../entities/password-recovery.entity';

@Injectable()
export class ProfileRepository {
  constructor(private prisma: PrismaService) {}

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
}
