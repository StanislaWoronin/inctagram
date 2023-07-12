import { Photos as IPhotos } from '@prisma/client';
import { PhotoType } from '../../../libs/shared/enums/photo-type.enum';

export class Photos implements IPhotos {
  id: string;
  userId: string;
  photoType: PhotoType;
  photoLink: string;
}
