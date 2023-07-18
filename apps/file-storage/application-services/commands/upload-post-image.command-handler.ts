import { UploadPostImagesDto } from '../../../main-app/users/dto/create-post.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { S3StorageAdapter } from '../../../../libs/adapters/file-storage.adapter/file.storage.adapter';
import sharp from 'sharp';
import { fileStorageConstants } from '../../image-validator/file-storage.constants';

export class UploadPostImagesCommand {
  constructor(public readonly dto: UploadPostImagesDto) {}
}

@CommandHandler(UploadPostImagesCommand)
export class UploadPostImagesCommandHandler
  implements ICommandHandler<UploadPostImagesCommand, string[]>
{
  constructor(private filesStorageAdapter: S3StorageAdapter) {}

  async execute({ dto }: UploadPostImagesCommand): Promise<string[]> {
    const photoImages = [];
    for (const postPhoto of dto.postPhotos) {
      const buffer = Buffer.from(postPhoto);
      const correctFormatBuffer = await sharp(buffer)
        .toFormat('png')
        .toBuffer();
      photoImages.push(correctFormatBuffer);
    }

    const photoLinks = await this.filesStorageAdapter.saveFiles(
      dto.userId,
      fileStorageConstants.post.name,
      photoImages,
    );

    return photoLinks;
  }
}
