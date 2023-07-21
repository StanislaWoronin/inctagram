import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserQueryRepository } from '../../apps/main-app/users/db.providers/user/user-query.repository';
import { ViewUser } from '../../apps/main-app/users/view-model/user.view-model';

@Injectable()
export class CheckCredentialGuard implements CanActivate {
  constructor(private userQueryRepository: UserQueryRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { email, password } = req.body;

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

    req.user = ViewUser.toView(user);
    return true;
  }
}
