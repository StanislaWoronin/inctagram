import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateMainImageDto } from '../../dto/update-main-image.dto';
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

export class UpdateMainImageCommand {
  constructor(public readonly dto: Partial<UpdateMainImageDto>) {}
}

@CommandHandler(UpdateMainImageCommand)
export class UpdateMainImageCommandHandler
  implements ICommandHandler<UpdateMainImageCommand, string>
{
  constructor(private filesStorageAdapter: S3StorageAdapter) {}

  async execute({ dto }: UpdateMainImageCommand): Promise<string> {
    const buffer = Buffer.from(dto.buffer);
    const correctFormatBuffer = await sharp(buffer).toFormat('png').toBuffer();

    const { photoLink } = await this.filesStorageAdapter.saveFile(
      dto.userId,
      fileStorageConstants.avatar.name,
      correctFormatBuffer,
    );

    return photoLink;
  }
}
