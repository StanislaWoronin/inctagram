import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AvatarDto } from '../../../../main-app/users/dto/avatar.dto';
import { S3StorageAdapter } from '../../../../../libs/adapters/file-storage-adapter/file.storage.adapter';
import sharp from 'sharp';
import { fileStorageConstants } from '../../../image-validator/file-storage.constants';
import { cloudSwitcher } from '../../../../../libs/adapters/file-storage-adapter/cloud.switcher';
import { UserIdWith } from '../../../../main-app/users/dto/id-with.dto';

export class UpdateAvatarCommand {
  constructor(public readonly dto: UserIdWith<AvatarDto>) {}
}

@CommandHandler(UpdateAvatarCommand)
export class UpdateAvatarCommandHandler
  implements ICommandHandler<UpdateAvatarCommand, string>
{
  constructor(private filesStorageAdapter: S3StorageAdapter) {}

  async execute({ dto }: UpdateAvatarCommand): Promise<string> {
    const buffer = Buffer.from(dto.avatar);
    const correctFormatBuffer = await sharp(buffer).toFormat('png').toBuffer();

    const cloudOptions = cloudSwitcher();

    await this.filesStorageAdapter.deleteFolder(
      cloudOptions.BUCKET_NAME,
      `${dto.userId}/${fileStorageConstants.avatar.name}`,
    );
    const { photoLink } = await this.filesStorageAdapter.saveFile(
      dto.userId,
      fileStorageConstants.avatar.name,
      correctFormatBuffer,
    );

    return photoLink;
  }
}
