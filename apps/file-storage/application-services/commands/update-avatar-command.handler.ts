import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateAvatarDto } from '../../../main-app/users/dto/update-avatar.dto';
import { S3StorageAdapter } from '../../../../libs/adapters/file-storage.adapter/file.storage.adapter';
import { FileStorageRepository } from '../../../main-app/users/db.providers/images/file.storage.repository';
import sharp from 'sharp';
import { FileStorageQueryRepository } from '../../../main-app/users/db.providers/images/file.storage.query.repository';
import { PhotoType } from '../../../../libs/shared/enums/photo-type.enum';
import {
  fileStorageConstants,
  ValidPhotoFormat,
} from '../../image-validator/file-storage.constants';
import { ConfigService } from '@nestjs/config';
import { log } from 'util';
import { Prisma } from '@prisma/client';
import {cloudSwitcher} from "../../../../libs/adapters/file-storage.adapter/cloud.switcher";

export class UpdateAvatarCommand {
  constructor(public readonly dto: UpdateAvatarDto) {}
}

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarCommandHandler
  implements ICommandHandler<UpdateAvatarCommand, string>
{
  constructor(private filesStorageAdapter: S3StorageAdapter) {}

  async execute({ dto }: UpdateAvatarCommand): Promise<string> {
    const buffer = Buffer.from(dto.file);
    const correctFormatBuffer = await sharp(buffer).toFormat('png').toBuffer();

    const cloudOptions = cloudSwitcher();
    await this.filesStorageAdapter.deleteFolder(
        cloudOptions.BUCKET_NAME,
        `${dto.userId}/${fileStorageConstants.avatar.name}`
    ) // TODO проверить
    const { photoLink } = await this.filesStorageAdapter.saveFile(
      dto.userId,
      fileStorageConstants.avatar.name,
      correctFormatBuffer,
    );

    return photoLink;
  }
}
