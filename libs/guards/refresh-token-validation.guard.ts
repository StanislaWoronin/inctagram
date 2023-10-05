import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '../../apps/main-app/users/db.providers/users/user.query-repository';

@Injectable()
export class RefreshTokenValidationGuard implements CanActivate {
  constructor(
    protected jwtService: JwtService,
    protected userQueryRepository: UserQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const tokenPayload: any = await this.jwtService.decode(
      req.cookies.refreshToken,
    );
    if (!tokenPayload) {
      throw new UnauthorizedException();
    }

    if (tokenPayload.exp * 1000 < Date.now()) {
      throw new UnauthorizedException();
    }

    const user = await this.userQueryRepository.getUserByDeviceId(
      tokenPayload.id,
      tokenPayload.deviceId,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    req.userId = tokenPayload.id;
    req.deviceId = tokenPayload.deviceId;
    return true;
  }
}
