import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user-query.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { UserRepository } from '../../db.providers/user.repository';
import { TokensFactory } from '../../../../../libs/shared/tokens.factory';
import { UnauthorizedException } from '@nestjs/common';
import { PairTokenDto } from '../../../auth/dto/pair-token.dto';
import { LoginDto } from '../../../auth/dto/login.dto';
import { WithClientMeta } from '../../../auth/dto/session-id.dto';
import { Device } from '../../entities/device.entity';

export class LoginUserCommand {
  constructor(public readonly dto: WithClientMeta<LoginDto>) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler
  implements ICommandHandler<LoginUserCommand, PairTokenDto>
{
  constructor(
    private userQueryRepository: UserQueryRepository,
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private factory: TokensFactory,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<PairTokenDto> {
    const { email, password, ipAddress, title } = dto;

    const user = await this.userQueryRepository.getUserWithPrivateField(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!user.isConfirmed) {
      throw new UnauthorizedException();
    }
    const passwordEqual = await bcrypt.compare(password, user.passwordHash);
    if (!passwordEqual) {
      throw new UnauthorizedException();
    }

    const device = await Device.create({ userId: user.id, ipAddress, title });
    await this.userRepository.createUserDevice(device);

    return await this.factory.getPairTokens(user.id, device.deviceId);
  }
}
