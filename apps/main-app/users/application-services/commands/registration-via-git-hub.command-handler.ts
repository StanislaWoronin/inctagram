import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {TCreateUserResponse} from './create-user.command-handler';
import {GitHubAdapter} from '../../../../../libs/adapters/third-party-services.adapter/git-hub.adapter';
import {RegistrationViaThirdPartyServicesDto} from '../../../auth/dto/registration-via-third-party-services.dto';
import {UserRepository} from '../../db.providers/user/user.repository';
import {NewUser} from '../../entities/new-user.entity';
import {ViewUser} from '../../view-model/user.view-model';
import {Inject} from '@nestjs/common';
import {Microservices} from '../../../../../libs/shared/enums/microservices-name.enum';
import {EmailManager} from "../../../../../libs/adapters/email.adapter";
import {UserQueryRepository} from "../../db.providers/user/user-query.repository";
import {getClientName} from "../../../../../libs/shared/helpers";
import {OAuthService} from "../../../../../libs/adapters/third-party-services.adapter/oauth.service";

export class RegistrationViaGitHubCommand {
  constructor(public readonly dto: RegistrationViaThirdPartyServicesDto) {}
}

@CommandHandler(RegistrationViaGitHubCommand)
export class RegistrationViaGitHubCommandHandler
  implements
    ICommandHandler<RegistrationViaGitHubCommand, TCreateUserResponse | null>
{
  constructor(
    private readonly emailManager: EmailManager,
    private gitHubAdapter: GitHubAdapter,
    private oauthService: OAuthService
  ) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TCreateUserResponse | null> {
    const accessToken = await this.gitHubAdapter.validate(dto.code);
    const user = await this.gitHubAdapter.getUserByToken(accessToken);

    return await this.oauthService.registerUser(user)
  }
}
