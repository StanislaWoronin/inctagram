import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GitHubAdapter } from '../../../../libs/adapters/third-party-services-adapter/git-hub.adapter';
import {
  RegistrationViaThirdPartyServicesDto,
  TLoginUserViaThirdPartyServices,
  TRegistrationViaThirdPartyServices,
} from '../dto/registration-via-third-party-services.dto';
import { OAuthService } from '../../../../libs/adapters/third-party-services-adapter/oauth.service';
import { WithClientMeta } from '../dto/session-id.dto';

export class RegistrationViaGitHubCommand {
  constructor(
    public readonly dto: WithClientMeta<RegistrationViaThirdPartyServicesDto>,
  ) {}
}

@CommandHandler(RegistrationViaGitHubCommand)
export class RegistrationViaGitHubCommandHandler
  implements
    ICommandHandler<
      RegistrationViaGitHubCommand,
      TLoginUserViaThirdPartyServices
    >
{
  constructor(
    private gitHubAdapter: GitHubAdapter,
    private oauthService: OAuthService,
  ) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TLoginUserViaThirdPartyServices> {
    const accessToken = await this.gitHubAdapter.validate(
      dto.code,
      dto.language,
    );
    const gitHubUser = await this.gitHubAdapter.getUserByToken(accessToken);

    return await this.oauthService.registerUser({
      id: gitHubUser.id,
      name: gitHubUser.name,
      email: gitHubUser.email,
      picture: gitHubUser.avatarUrl,
      clientMeta: dto.clientMeta,
      language: dto.language,
    });
  }
}
