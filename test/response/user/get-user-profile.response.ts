import { FullUser } from '../../types/full-user.type';
import { fileStorageConstants } from '../../../apps/file-storage/image-validator/file-storage.constants';

export const getUserProfileResponse = (
  fullUser: Partial<FullUser>,
  avatarLink: string = fileStorageConstants.avatar.defaultLink,
) => {
  const user = new FullUser();
  Object.assign(user, fullUser);

  return {
    id: user.id || expect.any(String),
    userName: user.userName,
    email: user.email || expect.any(String),
    createdAt: user.createdAt || expect.any(String),
    firstName: user.firstName,
    lastName: user.lastName,
    birthday: user.birthday,
    city: user.city,
    aboutMe: user.aboutMe,
    linkToMainImage: avatarLink,
  };
};
