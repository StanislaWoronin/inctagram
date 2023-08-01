import { BadRequestException, Injectable } from '@nestjs/common';
import { NewUser } from '../../../apps/main-app/users/entities/new-user.entity';
import { getClientName } from '../../shared/helpers';
import { ViewUser } from '../../../apps/main-app/users/view-model/user.view-model';
import { EmailManager } from '../email.adapter';
import { UserRepository } from '../../../apps/main-app/users/db.providers/users/user.repository';
import { UserQueryRepository } from '../../../apps/main-app/users/db.providers/users/user.query-repository';
import { TokensFactory } from '../../shared/tokens.factory';
import { randomUUID } from 'crypto';
import { TRegistrationViaThirdPartyServices } from '../../../apps/main-app/auth/dto/registration-via-third-party-services.dto';

@Injectable()
export class OAuthService {
  constructor(
    private emailManager: EmailManager,
    private factory: TokensFactory,
    private userRepository: UserRepository,
    private userQueryRepository: UserQueryRepository,
  ) {}

  async registerUser({
    name,
    email,
    avatarUrl,
    ipAddress,
    title,
  }): Promise<TRegistrationViaThirdPartyServices | null> {
    const user = await this.userQueryRepository.getUserByField(email);
    if (user) {
      if (user.isConfirmed) {
        throw new BadRequestException('email:This email already confirmed.');
      }
      this.emailManager.sendRefinementEmail(user.email);
      return null;
    }

    const lastClientName = await this.userQueryRepository.getLastClientName();
    const newUser = NewUser.createViaThirdPartyServices({ name, email });
    newUser.userName = getClientName(lastClientName);

    const deviceId = randomUUID();
    const createdUser =
      await this.userRepository.createUserViaThirdPartyServices({
        user: newUser,
        photoLink: avatarUrl,
        deviceId,
        ipAddress,
        title,
      });

    this.emailManager.sendCongratulationWithAuthEmail(createdUser.email);
    const tokens = await this.factory.getPairTokens(createdUser.id, deviceId);

    const viewUser = await ViewUser.toView(createdUser);
    return { user: viewUser, ...tokens };
  }
}
