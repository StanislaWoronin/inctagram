import { cloudSwitcher } from '../adapters/file-storage-adapter/cloud.switcher';
import { settings } from './settings';

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

export const getSkipCount = (page: number) => {
  const pageSize = settings.pagination.pageSize;
  return (page - 1) * pageSize;
};

export const getClientName = (lastClientName?: string): string => {
  if (!lastClientName) {
    return settings.clientName + 1;
  }
  const lastIndex = lastClientName.replace(settings.clientName, '');
  const newIndex = Number(lastIndex) + 1;

  return `${settings.clientName}${newIndex}`;
};
