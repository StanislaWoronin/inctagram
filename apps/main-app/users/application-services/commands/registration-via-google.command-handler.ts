import {
  RegistrationViaThirdPartyServicesDto,
  TRegistrationViaThirdPartyServices,
} from '../../../auth/dto/registration-via-third-party-services.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationViaGitHubCommand } from './registration-via-git-hub.command-handler';
import { GoogleAdapter } from '../../../../../libs/adapters/third-party-services.adapter/google.adapter';
import { EmailManager } from '../../../../../libs/adapters/email.adapter';
import { OAuthService } from '../../../../../libs/adapters/third-party-services.adapter/oauth.service';
import { WithClientMeta } from '../../../auth/dto/session-id.dto';

export class RegistrationViaGoogleCommand {
  constructor(
    public readonly dto: WithClientMeta<RegistrationViaThirdPartyServicesDto>,
  ) {}
}

@CommandHandler(RegistrationViaGoogleCommand)
export class RegistrationViaGoogleCommandHandler
  implements
    ICommandHandler<
      RegistrationViaGoogleCommand,
      TRegistrationViaThirdPartyServices | null
    >
{
  constructor(
    private readonly emailManager: EmailManager,
    private googleAdapter: GoogleAdapter,
    private oauthService: OAuthService,
  ) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TRegistrationViaThirdPartyServices | null> {
    const { id_token, access_token } =
      await this.googleAdapter.getGoogleOAuthTokens(dto.code);

    const googleUser = await this.googleAdapter.getGoogleUser({
      id_token,
      access_token,
    });

    return await this.oauthService.registerUser({
      name: googleUser.name,
      email: googleUser.email,
      avatarUrl: googleUser.picture,
      ipAddress: dto.ipAddress,
      title: dto.title,
    });
  }
}
