import { fileStorageConstants } from './file-storage.constants';
import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';

export class ImageValidator {
  async transform(image: Express.Multer.File) {
    console.log({ image });
    await isValidImage(fileStorageConstants.avatar.size, image);
    const buffer = image.buffer;
    return buffer;
  }
}

export const isValidImage = async (
  imageSize: number,
  image: Express.Multer.File,
): Promise<boolean> => {
  let metadata;
  try {
    metadata = await sharp(image.buffer).metadata();
  } catch (e) {
    throw new BadRequestException('format:Not supported format.');
  }

  if (metadata.size > imageSize) {
    throw new BadRequestException('size:Image size exceeds the allowed limit.');
  }

  return true;
};
