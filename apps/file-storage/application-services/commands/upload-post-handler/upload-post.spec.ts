import { S3StorageAdapter } from '../../../../../libs/adapters/file-storage-adapter/file.storage.adapter';
import { UploadPostImagesCommandHandler } from './upload-post-image.command-handler';
import { join } from 'path';
import { images } from '../../../../../test/images/images';
import { readFileSync } from 'fs';
import { UserIdWith } from '../../../../main-app/users/dto/id-with.dto';
import { randomUUID } from 'crypto';
import { PostImagesDto } from '../../../../main-app/users/dto/post-images.dto';

describe('Upload post.', () => {
  const filesStorageAdapter = new S3StorageAdapter();
  const uploadPostImagesCommandHandler = new UploadPostImagesCommandHandler(
    filesStorageAdapter,
  );

  const imagePath = join(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'test',
    'images',
    'avatar',
    images.avatar.fist,
  );
  const imageBuffer = readFileSync(imagePath);
  const bufferArray = [];
  bufferArray.push(imageBuffer);

  const dto: UserIdWith<PostImagesDto> = {
    userId: randomUUID(),
    postPhotos: bufferArray,
  };

  describe('Test upload post.', () => {
    it('Upload post with one photo.', async () => {
      const result = await uploadPostImagesCommandHandler.execute({ dto });
      expect(result).toBeDefined();
      expect(typeof result[0]).toBe('string');
    });

    const count = 4;
    for (let i = 0; i < count; i++) {
      bufferArray.push(imageBuffer);
    }

    it('Should upload many photo.', async () => {
      const result = await uploadPostImagesCommandHandler.execute({ dto });
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(count + 1);
    });
  });
});
