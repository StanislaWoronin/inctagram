import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user/user.repository';
import { TokensFactory } from '../../../../../libs/shared/tokens.factory';
import { PairTokenDto } from '../../../auth/dto/pair-token.dto';
import { LoginDto } from '../../../auth/dto/login.dto';
import { WithClientMeta } from '../../../auth/dto/session-id.dto';
import { Device } from '../../entities/device.entity';
import { UserIdWith } from '../../dto/id-with.dto';

export class LoginUserCommand {
  constructor(public readonly dto: WithClientMeta<UserIdWith<LoginDto>>) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler
  implements ICommandHandler<LoginUserCommand, PairTokenDto>
{
  constructor(
    private userRepository: UserRepository,
    private factory: TokensFactory,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<PairTokenDto> {
    const { userId, ipAddress, title } = dto;

    const device = await Device.create({ userId, ipAddress, title });
    await this.userRepository.createUserDevice(device);

    return await this.factory.getPairTokens(userId, device.deviceId);
  }
}
