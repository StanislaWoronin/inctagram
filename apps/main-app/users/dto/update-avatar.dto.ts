import { Avatar } from '@prisma/client';

type TUpdateAvatarDto = Pick<Avatar, 'userId'> & {
  file: Buffer;
};

export class UpdateAvatarDto implements TUpdateAvatarDto {
  public userId: string;
  public file: Buffer;
}
