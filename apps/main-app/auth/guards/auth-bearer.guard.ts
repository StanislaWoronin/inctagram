import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserQueryRepository } from '../../users/db.providers/user-query.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthBearerGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private queryUsersRepository: UserQueryRepository,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader)
      throw new UnauthorizedException('Token not found');

    const [key, token] = authorizationHeader.split(' ');
    if (key !== 'Bearer') throw new UnauthorizedException('Wrong token');
    if (!token) throw new UnauthorizedException('Token not found');

    let tokenPayload;
    try {
      tokenPayload: tokenPayload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      });
      if (!tokenPayload) throw new UnauthorizedException('Wrong token');
    } catch (e) {
      throw new UnauthorizedException('Wrong token');
    }

    const userExist = await this.queryUsersRepository.getUserByField(
      tokenPayload.id,
    );
    if (!userExist) throw new UnauthorizedException("User doesn't exist");

    req.userId = tokenPayload.id;
    req.token = tokenPayload;
    return true;
  }
}
