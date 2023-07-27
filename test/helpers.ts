import { createReadStream } from 'fs';

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
