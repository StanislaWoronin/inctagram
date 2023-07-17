import { UpdateMainImageDto } from '../../../../file-storage/dto/update-main-image.dto';
import { CommandHandler, ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { Commands } from '../../../../../libs/shared/enums/pattern-commands-name.enum';
import { lastValueFrom, map } from 'rxjs';
import { Inject } from '@nestjs/common';
import { Microservices } from '../../../../../libs/shared/enums/microservices-name.enum';
import { ClientProxy } from '@nestjs/microservices';
import { FileStorageRepository } from '../../db.providers/images/file.storage.repository';
import { PhotoType } from '../../../../../libs/shared/enums/photo-type.enum';

export class UploadUserAvatarCommand {
  constructor(public readonly dto: Partial<UpdateMainImageDto>) {}
}

@CommandHandler(UploadUserAvatarCommand)
export class UploadAvatarCommandHandler
  implements ICommandHandler<UploadUserAvatarCommand, boolean>
{
  constructor(
    @Inject(Microservices.FileStorage)
    private fileStorageProxyClient: ClientProxy,
    private fileStorageRepository: FileStorageRepository,
  ) {}

  async execute({ dto }: UploadUserAvatarCommand): Promise<boolean> {
    const pattern = { cmd: Commands.UpdateMainImage };
    const avatarLink = await lastValueFrom(
      this.fileStorageProxyClient
        .send(pattern, dto)
        .pipe(map((result) => result)),
    );

    await this.fileStorageRepository.deleteOldAvatar(dto.userId);
    return await this.fileStorageRepository.saveImage(
      dto.userId,
      PhotoType.Avatar,
      avatarLink,
    );
  }
}
