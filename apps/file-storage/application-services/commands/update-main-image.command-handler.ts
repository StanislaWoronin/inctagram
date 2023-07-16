import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMainImageDto } from '../../dto/update-main-image.dto';
import { S3StorageAdapter } from '../../../../libs/adapters/file-storage.adapter/file.storage.adapter';
import { FileStorageRepository } from '../../db.providers/file.storage.repository';
import sharp from 'sharp';
import { FileStorageQueryRepository } from '../../db.providers/file.storage.query.repository';
import { PhotoType } from '../../../../libs/shared/enums/photo-type.enum';
import {
  fileStorageConstants,
  ValidPhotoFormat,
} from '../../image-validator/file-storage.constants';
import { ConfigService } from '@nestjs/config';
import { log } from 'util';
import { Prisma } from '@prisma/client';

export class UpdateMainImageCommand {
  constructor(public readonly dto: Partial<UpdateMainImageDto>) {}
}

@CommandHandler(UpdateMainImageCommand)
export class UpdateMainImageCommandHandler
  implements ICommandHandler<UpdateMainImageCommand>
{
  constructor(
    private filesStorageAdapter: S3StorageAdapter,
    private fileStorageRepository: FileStorageRepository,
    private fileStorageQueryRepository: FileStorageQueryRepository,
  ) {}

  async execute({ dto }: UpdateMainImageCommand): Promise<boolean> {
    const photo = await this.fileStorageQueryRepository.getPhotosByUserId(
      dto.userId,
      PhotoType.Avatar,
    );
    console.log({ photo });

    const buffer = Buffer.from(dto.buffer);
    const correctFormatBuffer = await sharp(buffer).toFormat('png').toBuffer();

    const { photoLink } = await this.filesStorageAdapter.saveFile(
      dto.userId,
      fileStorageConstants.avatar.name,
      correctFormatBuffer,
    );

    if (photo) {
      const deleteInCloud = this.filesStorageAdapter.deleteImage(
        photo.photoLink,
      );
      const deleteInBd = this.fileStorageRepository.updateImage(
        photo.id,
        photoLink,
      );
      await Promise.all([deleteInCloud, deleteInBd]);
      return true;
    }

    return await this.fileStorageRepository.createImage({
      userId: dto.userId,
      photoType: PhotoType.Avatar,
      photoLink,
    });
  }
}
