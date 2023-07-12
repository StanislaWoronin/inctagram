import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../db.providers/user.repository';
import { UserQueryRepository } from '../../db.providers/user-query.repository';
import { TokensFactory } from '../../../../../libs/shared/tokens.factory';
import { PairTokenDto } from '../../../auth/dto/pair-token.dto';
import { SessionIdDto, WithClientMeta } from '../../../auth/dto/session-id.dto';
import { Device } from '../../entities/device.entity';

export class UpdatePairTokenCommand {
  constructor(public readonly dto: WithClientMeta<SessionIdDto>) {}
}

@CommandHandler(UpdatePairTokenCommand)
export class UpdatePairTokenCommandHandler
  implements ICommandHandler<UpdatePairTokenCommand, PairTokenDto>
{
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
    private factory: TokensFactory,
  ) {}

  async execute({ dto }: UpdatePairTokenCommand): Promise<PairTokenDto> {
    let { userId, deviceId, ipAddress, title } = dto;
    const device = await this.userQueryRepository.getUserDevice(
      userId,
      deviceId,
    );

    const ipIsDifferent = device.ipAddress !== ipAddress;
    const titleIsDifferent = device.title !== title;
    if (ipIsDifferent && titleIsDifferent) {
      const device = Device.create({ userId, ipAddress, title });
      const createdDevice = await this.userRepository.createUserDevice(device);
      deviceId = createdDevice.deviceId;
    }

    return await this.factory.getPairTokens(userId, deviceId);
  }
}
