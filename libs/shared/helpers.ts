import { cloudSwitcher } from '../adapters/file-storage.adapter/cloud.switcher';
import {fileStorageConstants} from "../../apps/file-storage/image-validator/file-storage.constants";
import {settings} from "./settings";

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
  const pageSize = settings.pagination.pageSize
  return (page - 1) * pageSize;
};
