import { RegistrationViaThirdPartyServicesDto } from '../../../auth/dto/registration-via-third-party-services.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TCreateUserResponse } from './create-user.command-handler';
import { UserRepository } from '../../db.providers/user/user.repository';
import { RegistrationViaGitHubCommand } from './registration-via-git-hub.command-handler';
import { GoogleAdapter } from '../../../../../libs/adapters/third-party-services.adapter/google.adapter';
import { NewUser } from '../../entities/new-user.entity';
import { ViewUser } from '../../view-model/user.view-model';
import { Inject } from '@nestjs/common';
import { Microservices } from '../../../../../libs/shared/enums/microservices-name.enum';
import { ClientProxy } from '@nestjs/microservices';
import { FileStorageRepository } from '../../db.providers/images/file.storage.repository';
import {JwtService} from "@nestjs/jwt";
import {UserQueryRepository} from "../../db.providers/user/user-query.repository";
import {EmailManager} from "../../../../../libs/adapters/email.adapter";
import {getClientName} from "../../../../../libs/shared/helpers";
import {OAuthService} from "../../../../../libs/adapters/third-party-services.adapter/oauth.service";

export class RegistrationViaGoogleCommand {
  constructor(public readonly dto: RegistrationViaThirdPartyServicesDto) {}
}

@CommandHandler(RegistrationViaGoogleCommand)
export class RegistrationViaGoogleCommandHandler
  implements
    ICommandHandler<RegistrationViaGoogleCommand, TCreateUserResponse | null>
{
  constructor(
    private readonly emailManager: EmailManager,
    private googleAdapter: GoogleAdapter,
    private oauthService: OAuthService
  ) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TCreateUserResponse | null> {
    const {id_token, access_token} = await this.googleAdapter.getGoogleOAuthTokens(dto.code)
    const googleUser = await this.googleAdapter.getGoogleUser({id_token, access_token})

    return await this.oauthService.registerUser({
      name: googleUser.name,
      email: googleUser.email,
      avatarUrl: googleUser.picture
    })
  }
}
