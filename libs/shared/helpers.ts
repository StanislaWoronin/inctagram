import { cloudSwitcher } from '../adapters/file-storage.adapter/cloud.switcher';

export const encodeBirthday = (value: string) => {
  return value.split('.').reverse().join('-');
};

export const decodeBirthday = (value: Date | string) => {
  return new Date(value).toLocaleDateString().split('.').join('.');
};

export const toViewPhotoLink = (value: string) => {
  const cloudOptions = cloudSwitcher();
  return `${cloudOptions.BASE_URL}/${value}`;
};
