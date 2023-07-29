import { createReadStream } from 'fs';
import { settings } from '../libs/shared/settings';

export const sleep = (delay: number) => {
  const second = 1000;
  return new Promise((resolve) => setTimeout(resolve, delay * second));
};

export const fileToBuffer = (filename): Promise<Buffer> => {
  const readStream = createReadStream(filename);
  const chunks = [];
  return new Promise((resolve, reject) => {
    readStream.on('error', (err) => {
      reject(err);
    });

    readStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    readStream.on('close', () => {
      resolve(Buffer.concat(chunks));
    });
  });
};

export const checkSortingOrder = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }

  let increasing = true;
  let decreasing = true;

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].createdAt < arr[i + 1].createdAt) {
      decreasing = false;
    } else if (arr[i].createdAt > arr[i + 1].createdAt) {
      increasing = false;
    }

    if (!increasing && !decreasing) {
      return null;
    }
  }

  return increasing ? false : true;
};

export const countPageElements = (
  totalCount: number,
  pageNumber = 1,
  pageSize = settings.pagination.pageSize,
) => {
  return totalCount > pageSize
    ? pageSize
    : totalCount - pageNumber * pageSize > pageSize
    ? pageSize
    : totalCount - pageNumber * pageSize;
};
