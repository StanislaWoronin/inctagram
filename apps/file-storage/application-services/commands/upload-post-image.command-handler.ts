import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { S3StorageAdapter } from '../../../../libs/adapters/file-storage.adapter/file.storage.adapter';
import sharp from 'sharp';
import { fileStorageConstants } from '../../image-validator/file-storage.constants';
import {PostImagesDto} from "../../../main-app/users/dto/post-images.dto";
import {UserIdWith} from "../../../main-app/users/dto/user-with.dto";

export class UploadPostImagesCommand {
  constructor(public readonly dto: UserIdWith<PostImagesDto>) {}
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
