import { PhotoType } from '../../../libs/shared/enums/photo-type.enum';
import { settings } from '../../../libs/shared/settings';

export const fileStorageConstants = {
  avatar: {
    name: PhotoType.Avatar,
    size: 1000000, // 10 ** 6
    defaultLink: `${settings.cloud.YandexCloud.BUCKET_NAME}/avatars/defaultAvatar.png`,
  },
  post: {
    name: PhotoType.PostImages
  }
};

export enum ValidPhotoFormat {
  Png = 'png',
  Jpg = 'jpg',
  Jpeg = 'jpeg',
}
