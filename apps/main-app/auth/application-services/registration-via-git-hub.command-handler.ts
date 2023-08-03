import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GitHubAdapter } from '../../../../libs/adapters/third-party-services.adapter/git-hub.adapter';
import {
  RegistrationViaThirdPartyServicesDto,
  TRegistrationViaThirdPartyServices,
} from '../dto/registration-via-third-party-services.dto';
import { EmailManager } from '../../../../libs/adapters/email.adapter';
import { OAuthService } from '../../../../libs/adapters/third-party-services.adapter/oauth.service';
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
      TRegistrationViaThirdPartyServices | null
    >
{
  constructor(
    private readonly emailManager: EmailManager,
    private gitHubAdapter: GitHubAdapter,
    private oauthService: OAuthService,
  ) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TRegistrationViaThirdPartyServices | null> {
    const accessToken = await this.gitHubAdapter.validate(dto.code);
    const user = await this.gitHubAdapter.getUserByToken(accessToken);

    return await this.oauthService.registerUser({
      ...user,
      ipAddress: dto.ipAddress,
      title: dto.title,
    });
  }
}
