import { AvatarDto } from '../../dto/avatar.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Commands } from '../../../../../libs/shared/enums/pattern-commands-name.enum';
import { lastValueFrom, map } from 'rxjs';
import { Inject } from '@nestjs/common';
import { Microservices } from '../../../../../libs/shared/enums/microservices-name.enum';
import { ClientProxy } from '@nestjs/microservices';
import { AvatarRepository } from '../../db.providers/images/avatar.repository';
import { UserIdWith } from '../../dto/id-with.dto';

export class UploadUserAvatarCommand {
  constructor(public readonly dto: UserIdWith<AvatarDto>) {}
}

@CommandHandler(UploadUserAvatarCommand)
export class UploadAvatarCommandHandler
  implements ICommandHandler<UploadUserAvatarCommand, boolean>
{
  constructor(
    @Inject(Microservices.FileStorage)
    private fileStorageProxyClient: ClientProxy,
    private avatarRepository: AvatarRepository,
  ) {}

  async execute({ dto }: UploadUserAvatarCommand): Promise<boolean> {
    const pattern = { cmd: Commands.UpdateAvatar };
    const avatarLink = await lastValueFrom(
      this.fileStorageProxyClient
        .send(pattern, dto)
        .pipe(map((result) => result)),
    );

    await this.avatarRepository.deleteOldAvatar(dto.userId);
    return await this.avatarRepository.saveAvatar(dto.userId, avatarLink);
  }
}
