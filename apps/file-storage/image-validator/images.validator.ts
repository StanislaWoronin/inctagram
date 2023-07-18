import {
  fileStorageConstants,
  ValidPhotoFormat,
} from './file-storage.constants';
import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import sharp from 'sharp';
import { getUserProfileResponse } from '../../../test/response/user/get-user-profile.response';
import { log } from 'util';

export class ImagesValidator {
  async transform(images: Array<Express.Multer.File>) {
    await isValidImages(fileStorageConstants.avatar.size, images);
    const buffers = images.map((image) => image.buffer);
    return buffers;
  }
}

export const isValidImages = async (
  imageSize: number,
  images: Array<Express.Multer.File>,
): Promise<boolean> => {
  console.log(images.length);
  if (images.length > fileStorageConstants.post.maxPostsCount)
    throw new BadRequestException(
      `${fileStorageConstants.post.name}:Number of uploaded photos exceeded`,
    );

  let metadata;
  for (const image of images) {
    try {
      metadata = await sharp(image.buffer).metadata();
    } catch (e) {
      throw new BadRequestException('format:Not supported format.');
    }

    if (metadata.size > imageSize) {
      throw new BadRequestException(
        'size:Image size exceeds the allowed limit.',
      );
    } // FilesInterceptor/MulterOptions/limits/fieldNameSize Max field value size (Default: 1MB)
  }

  return true;
};
