import { PhotoType } from '../../../libs/shared/enums/photo-type.enum';

export const fileStorageConstants = {
  avatar: {
    name: PhotoType.Avatar,
    size: 1000000, // 10 ** 6
    defaultLink:
      'https://userimagesbucketinc.s3.eu-central-1.amazonaws.com/defaultMainImage/f2e9f6ca-d336-4ec3-83fb-8b84809202af.png',
  },
};

export enum ValidPhotoFormat {
  Png = 'png',
  Jpg = 'jpg',
  Jpeg = 'jpeg',
}
