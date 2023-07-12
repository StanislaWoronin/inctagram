import {
  fileStorageConstants,
  ValidPhotoFormat,
} from './file-storage.constants';
import { BadRequestException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import sharp from 'sharp';

export class ImageValidator {
  async transform(image: Express.Multer.File) {
    await isValidImage(fileStorageConstants.avatar.size, image);

    return image;
  }
}

export const isValidImage = async (
  imageSize: number,
  image: Express.Multer.File,
): Promise<boolean> => {
  try {
    const { format } = await sharp(image.buffer).metadata();
    // @ts-ignore
    if (!Object.values(ValidPhotoFormat).includes(format))
      new BadRequestException('format:Not supported format.');
  } catch (e) {
    new BadRequestException('format:Not supported format.');
  }

  const { size } = await sharp(image.buffer).metadata();
  if (size > imageSize)
    throw new RpcException(
      new BadRequestException('size:Image size exceeds the allowed limit.'),
    );

  return true;
};
