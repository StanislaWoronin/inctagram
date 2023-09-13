import { BadRequestException, Injectable } from '@nestjs/common';
import { NewUser } from '../../../apps/main-app/users/entities/new-user.entity';
import { getClientName } from '../../shared/helpers';
import { ViewUser } from '../../../apps/main-app/users/view-model/user.view-model';
import { EmailManager } from '../email.adapter';
import { UserRepository } from '../../../apps/main-app/users/db.providers/users/user.repository';
import { UserQueryRepository } from '../../../apps/main-app/users/db.providers/users/user.query-repository';
import { TokensFactory } from '../../shared/tokens.factory';
import { randomUUID } from 'crypto';
import { WithClientMeta } from '../../../apps/main-app/auth/dto/session-id.dto';
import { GoogleUserDto } from '../../../apps/main-app/auth/dto/google-user.dto';
import { TLoginUserViaThirdPartyServices } from '../../../apps/main-app/auth/dto/registration-via-third-party-services.dto';
import { ViewUserWithInfo } from '../../../apps/main-app/users/view-model/user-with-info.view-model';

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
  >): Promise<TLoginUserViaThirdPartyServices> {
    let user = await this.userQueryRepository.getUserByField(id);

    const deviceId = randomUUID();
    const tokens = await this.factory.getPairTokens(id, deviceId);
    let isAuth = true;
    if (!user) {
      isAuth = false;
      const userExists = await this.userQueryRepository.getUserByField(email);
      if (userExists) {
        if (userExists.isConfirmed) {
          throw new BadRequestException('email:This email already confirmed.');
        }
        this.emailManager.sendRefinementEmail(userExists.email, language);
        throw new BadRequestException('email:You can merge profile..');
      }

      const lastClientName = await this.userQueryRepository.getLastClientName();
      const newUser = NewUser.createViaThirdPartyServices({ name, email });
      newUser.userName = getClientName(lastClientName);

      user = await this.userRepository.createUserViaThirdPartyServices({
        id,
        user: newUser,
        photoLink: picture,
        deviceId,
        clientMeta,
      });

      this.emailManager.sendCongratulationWithAuthEmail(user.email);
    }

    const viewUser = await ViewUserWithInfo.toViewProfile(user);
    return { user: viewUser, ...tokens, isAuth };
  }
}
