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

export class RegistrationViaGoogleCommand {
  constructor(public readonly dto: RegistrationViaThirdPartyServicesDto) {}
}

@CommandHandler(RegistrationViaGoogleCommand)
export class RegistrationViaGoogleCommandHandler
  implements
    ICommandHandler<RegistrationViaGoogleCommand, TCreateUserResponse | null>
{
  constructor(
    @Inject(Microservices.FileStorage)
    private fileStorageProxyClient: ClientProxy,
    private googleAdapter: GoogleAdapter,
    private fileStorageRepository: FileStorageRepository,
    private userRepository: UserRepository,
  ) {}

  async execute({
    dto,
  }: RegistrationViaGitHubCommand): Promise<TCreateUserResponse | null> {
    await this.googleAdapter.init();
    const user = await this.googleAdapter.loginGoogleUser(dto.code);

    const newUser = NewUser.createViaThirdPartyServices(user);
    const createdUser =
      await this.userRepository.createUserViaThirdPartyServices(
        newUser,
        user.avatarUrl,
      );

    return await ViewUser.toView(createdUser);
  }
}
