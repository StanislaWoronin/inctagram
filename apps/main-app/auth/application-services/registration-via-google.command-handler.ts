import {
  TAuthorizationViaThirdPartyServices,
  RegistrationViaThirdPartyServicesDto,
  TLoginUserViaThirdPartyServices,
  TRegistrationViaThirdPartyServices,
} from '../dto/registration-via-third-party-services.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationViaGitHubCommand } from './registration-via-git-hub.command-handler';
import { GoogleAdapter } from '../../../../libs/adapters/third-party-services-adapter/google.adapter';
import { EmailManager } from '../../../../libs/adapters/email.adapter';
import { OAuthService } from '../../../../libs/adapters/third-party-services-adapter/oauth.service';
import { WithClientMeta } from '../dto/session-id.dto';

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
      TRegistrationViaThirdPartyServices | TLoginUserViaThirdPartyServices
    >
{
  constructor(
    // private readonly emailManager: EmailManager,
    private googleAdapter: GoogleAdapter,
    private oauthService: OAuthService,
  ) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TAuthorizationViaThirdPartyServices> {
    const { id_token, access_token } =
      await this.googleAdapter.getGoogleOAuthTokens(dto.code, dto.language);

    const googleUser = await this.googleAdapter.getGoogleUser({
      id_token,
      access_token,
    });

    return await this.oauthService.registerUser({
      id: String(googleUser.id),
      name: googleUser.name,
      email: googleUser.email,
      picture: googleUser.picture,
      clientMeta: dto.clientMeta,
      language: dto.language,
    });
  }
}
