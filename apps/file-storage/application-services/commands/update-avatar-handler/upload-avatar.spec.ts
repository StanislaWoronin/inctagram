import { UpdateAvatarCommandHandler } from './update-avatar-command.handler';
import { S3StorageAdapter } from '../../../../../libs/adapters/file-storage-adapter/file.storage.adapter';
import { randomUUID } from 'crypto';
import { UserIdWith } from '../../../../main-app/users/dto/id-with.dto';
import { AvatarDto } from '../../../../main-app/users/dto/avatar.dto';
import { join } from 'path';
import { images } from '../../../../../test/images/images';
import { readFileSync } from 'fs';

describe('Upload avatar.', () => {
  const filesStorageAdapter = new S3StorageAdapter();
  const updateAvatarCommandHandler = new UpdateAvatarCommandHandler(
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

  const dto: UserIdWith<AvatarDto> = {
    userId: randomUUID(),
    avatar: imageBuffer,
  };

  describe('Test upload avatar.', () => {
    it('Should upload avatar', async () => {
      const result = await updateAvatarCommandHandler.execute({ dto });
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});
