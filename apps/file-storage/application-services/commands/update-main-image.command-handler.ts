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
import {Prisma} from "@prisma/client";

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
    private configService: ConfigService,
  ) {}

  async execute({ dto }: UpdateMainImageCommand): Promise<boolean> {
    const bucket = this.configService.get('BUCKET_NAME');
    await this.filesStorageAdapter.deleteFolder(
      bucket,
      `${dto.userId}/${fileStorageConstants.avatar.name}`,
    );
    const buffer = Buffer.from(dto.buffer);
    const correctFormatBuffer = await sharp(buffer).toFormat('png').toBuffer();

    const result = await this.filesStorageAdapter.saveFile(
      dto.userId,
      fileStorageConstants.avatar.name,
      correctFormatBuffer,
    );

    const photos = await this.fileStorageQueryRepository.getPhotosByUserId(
      dto.userId,
      PhotoType.Avatar
    );
    if (!photos) {
      const data = {
        user: {connect: {id: dto.userId}},
        photoType: PhotoType.Avatar,
        photoLink: result.photoLink,
      };
      return await this.fileStorageRepository.createMainImage(data);
    }

    const dataForUpdate = { photoLink: result.photoLink };
    return await this.fileStorageRepository.updateMainImage(
      dto.userId,
      PhotoType.Avatar,
      dataForUpdate,
    );
  }
}
