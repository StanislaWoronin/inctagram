import { ApiProperty } from '@nestjs/swagger';
import { ViewUser } from './user.view-model';
import { User } from '@prisma/client';
import { access } from 'fs';
import { FullUser, TFullUser } from '../../../../test/types/full-user.type';
import { fileStorageConstants } from '../../../file-storage/image-validator/file-storage.constants';
import {
  decodeBirthday,
  toViewPhotoLink,
} from '../../../../libs/shared/helpers';

export class ViewUserWithInfo extends ViewUser {
  @ApiProperty({ example: 'James' })
  firstName: string | null;

  @ApiProperty({ example: 'Bond' })
  lastName: string | null;

  @ApiProperty({ example: new Date().toLocaleDateString() })
  birthday: string | null;

  @ApiProperty({ example: 'London' })
  city: string | null;

  @ApiProperty({ example: 'spy' })
  aboutMe: string | null;

  @ApiProperty({
    example:
      'https://userimagesbucketinc.f2e9f6ca-d336-4ec3-83fb-8b84809202af.png',
  })
  avatarLink: string | null;

  static toView(user: Partial<FullUser>) {
    let birthday = null;
    if (user.birthday) birthday = decodeBirthday(user.birthday);

    const avatar = user.Photos[0]?.photoLink;
    let avatarLink = fileStorageConstants.avatar.defaultLink;
    if (avatar) {
      avatarLink = avatar;
    }

    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      createdAt: user.createdAt,
      firstName: user.firstName,
      lastName: user.lastName,
      birthday: birthday,
      city: user.city,
      aboutMe: user.aboutMe,
      avatarLink: toViewPhotoLink(avatarLink),
    };
  }
}
