import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TCreateUserResponse } from './create-user.command-handler';
import { GitHubAdapter } from '../../../../../libs/adapters/third-party-services.adapter/git-hub.adapter';
import { RegistrationViaThirdPartyServicesDto } from '../../../auth/dto/registration-via-third-party-services.dto';
import { UserRepository } from '../../db.providers/user/user.repository';
import { NewUser } from '../../entities/new-user.entity';
import { ViewUser } from '../../view-model/user.view-model';
import { Inject } from '@nestjs/common';
import { Microservices } from '../../../../../libs/shared/enums/microservices-name.enum';
import { ClientProxy } from '@nestjs/microservices';
import { Commands } from '../../../../../libs/shared/enums/pattern-commands-name.enum';
import { lastValueFrom, map } from 'rxjs';
import { FileStorageRepository } from '../../db.providers/images/file.storage.repository';

export class RegistrationViaGitHubCommand {
  constructor(public readonly dto: RegistrationViaThirdPartyServicesDto) {}
}

@CommandHandler(RegistrationViaGitHubCommand)
export class RegistrationViaGitHubCommandHandler
  implements
    ICommandHandler<RegistrationViaGitHubCommand, TCreateUserResponse | null>
{
  constructor(
    @Inject(Microservices.FileStorage)
    private fileStorageProxyClient: ClientProxy,
    private gitHubAdapter: GitHubAdapter,
    private fileStorageRepository: FileStorageRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TCreateUserResponse | null> {
    const accessToken = await this.gitHubAdapter.validate(dto.code);
    const user = await this.gitHubAdapter.getUserByToken(accessToken);

    const newUser = NewUser.createViaThirdPartyServices(user);
    const createdUser =
      await this.userRepository.createUserViaThirdPartyServices(
        newUser,
        user.avatarUrl,
      );

    return await ViewUser.toView(createdUser);
  }
}
