import { BadRequestException, Injectable } from '@nestjs/common';
import { NewUser } from '../../../apps/main-app/users/entities/new-user.entity';
import { getClientName } from '../../shared/helpers';
import { ViewUser } from '../../../apps/main-app/users/view-model/user.view-model';
import { EmailManager } from '../email.adapter';
import { UserRepository } from '../../../apps/main-app/users/db.providers/users/user.repository';
import { UserQueryRepository } from '../../../apps/main-app/users/db.providers/users/user.query-repository';
import { TokensFactory } from '../../shared/tokens.factory';
import { randomUUID } from 'crypto';
import {
  TAuthorizationViaThirdPartyServices,
  TLoginUserViaThirdPartyServices,
  TRegistrationViaThirdPartyServices,
} from '../../../apps/main-app/auth/dto/registration-via-third-party-services.dto';
import { WithClientMeta } from '../../../apps/main-app/auth/dto/session-id.dto';
import { GoogleUserDto } from '../../../apps/main-app/auth/dto/google-user.dto';

@Injectable()
export class OAuthService {
  constructor(
    private emailManager: EmailManager,
    private factory: TokensFactory,
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async registerUser({
    id,
    name,
    email,
    picture,
    clientMeta,
    language,
  }: Partial<
    WithClientMeta<GoogleUserDto>
  >): Promise<TAuthorizationViaThirdPartyServices> {
    const userExists = await this.userQueryRepository.getUserByField(id);

    const deviceId = randomUUID();
    const tokens = await this.factory.getPairTokens(id, deviceId);
    if (!userExists) {
      const user = await this.userQueryRepository.getUserByField(email);
      if (user) {
        if (user.isConfirmed) {
          throw new BadRequestException('email:This email already confirmed.');
        }
        this.emailManager.sendRefinementEmail(user.email, language);
        return null;
      }

      const lastClientName = await this.userQueryRepository.getLastClientName();
      const newUser = NewUser.createViaThirdPartyServices({ name, email });
      newUser.userName = getClientName(lastClientName);

      const createdUser =
        await this.userRepository.createUserViaThirdPartyServices({
          id,
          user: newUser,
          photoLink: picture,
          deviceId,
          clientMeta,
        });

      this.emailManager.sendCongratulationWithAuthEmail(createdUser.email);
      const viewUser = await ViewUser.toView(createdUser);

      return { user: viewUser, ...tokens };
    }

    return { ...tokens, isAuth: true };
  }
}
