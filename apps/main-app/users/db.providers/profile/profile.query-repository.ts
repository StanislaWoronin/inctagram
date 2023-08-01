import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../../libs/providers/prisma/prisma.service";
import {Device, User} from "@prisma/client";
import {ViewUser} from "../../view-model/user.view-model";

@Injectable()
export class ProfileQueryRepository {
    constructor(private prisma: PrismaService) {}

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
}