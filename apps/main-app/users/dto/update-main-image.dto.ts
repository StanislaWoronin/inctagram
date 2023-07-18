import { Photos } from '@prisma/client';

type TUpdateMainImageDto = Pick<Photos, 'userId'> & {
  file: Express.Multer.File;
  buffer: Buffer;
};

export class UpdateMainImageDto implements TUpdateMainImageDto {
  public userId: string;
  public file: Express.Multer.File;
  public buffer: Buffer;
}
