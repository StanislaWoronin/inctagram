import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../users/db.providers/users/user.repository';
import { UserQueryRepository } from '../../users/db.providers/users/user.query-repository';
import { TokensFactory } from '../../../../libs/shared/tokens.factory';
import { PairTokenDto } from '../dto/pair-token.dto';
import { SessionIdDto, WithClientMeta } from '../dto/session-id.dto';
import { Device } from '../../users/entities/device.entity';
import { ProfileRepository } from '../../users/db.providers/profile/profile.repository';
import { ProfileQueryRepository } from '../../users/db.providers/profile/profile.query-repository';

export class UpdatePairTokenCommand {
  constructor(public readonly dto: WithClientMeta<SessionIdDto>) {}
}

@CommandHandler(UpdatePairTokenCommand)
export class UpdatePairTokenCommandHandler
  implements ICommandHandler<UpdatePairTokenCommand, PairTokenDto>
{
  constructor(
    private profileRepository: ProfileRepository,
    private profileQueryRepository: ProfileQueryRepository,
    private factory: TokensFactory,
  ) {}

  async execute({ dto }: UpdatePairTokenCommand): Promise<PairTokenDto> {
    let { userId, deviceId, clientMeta, language } = dto;
    const device = await this.profileQueryRepository.getUserDevice(
      userId,
      deviceId,
    );

    const ipIsDifferent = device.ipAddress !== clientMeta.ipAddress;
    const titleIsDifferent = device.title !== clientMeta.title;
    if (ipIsDifferent && titleIsDifferent) {
      const device = Device.create({
        userId,
        ipAddress: clientMeta.ipAddress,
        title: clientMeta.title,
      });
      const createdDevice = await this.profileRepository.createUserDevice(
        device,
      );
      deviceId = createdDevice.deviceId;
    }

    return await this.factory.getPairTokens(userId, deviceId);
  }
}
