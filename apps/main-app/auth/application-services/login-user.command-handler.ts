import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensFactory } from '../../../../libs/shared/tokens.factory';
import { PairTokenDto } from '../dto/pair-token.dto';
import { LoginDto } from '../dto/login.dto';
import { WithClientMeta } from '../dto/session-id.dto';
import { Device } from '../../users/entities/device.entity';
import { UserIdWith } from '../../users/dto/id-with.dto';
import { ProfileRepository } from '../../users/db.providers/profile/profile.repository';

export class LoginUserCommand {
  constructor(public readonly dto: WithClientMeta<UserIdWith<LoginDto>>) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler
  implements ICommandHandler<LoginUserCommand, PairTokenDto>
{
  constructor(
    private profileRepository: ProfileRepository,
    private factory: TokensFactory,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<PairTokenDto> {
    const { userId, clientMeta } = dto;

    const device = await Device.create({
      userId,
      ipAddress: clientMeta.ipAddress,
      title: clientMeta.title,
    });
    await this.profileRepository.createUserDevice(device);

    return await this.factory.getPairTokens(userId, device.deviceId);
  }
}
