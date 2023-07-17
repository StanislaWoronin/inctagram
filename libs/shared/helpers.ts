import { cloudSwitcher } from '../adapters/file-storage.adapter/cloud.switcher';

export const encodeBirthday = (value: string): string => {
  return value.split('.').reverse().join('-');
};

export const decodeBirthday = (value: Date | string): string => {
  return new Date(value).toLocaleDateString().split('.').join('.');
};

export const toViewPhotoLink = (value: string): string => {
  const cloudOptions = cloudSwitcher();
  return `${cloudOptions.BASE_URL}/${value}`;
};
