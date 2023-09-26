import { ApiProperty } from '@nestjs/swagger';
import { ViewUser } from './user.view-model';
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

  static toViewProfile(user: Partial<FullUser>) {
    let birthday = null;
    if (user.birthday) birthday = decodeBirthday(user.birthday);

    let avatarLink = fileStorageConstants.avatar.defaultLink;
    if (user.Avatar?.photoLink) {
      avatarLink = user.Avatar.photoLink;
    }

    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      createdAt: user.createdAt,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      birthday: birthday ?? null,
      city: user.city ?? null,
      aboutMe: user.aboutMe ?? null,
      avatarLink: toViewPhotoLink(avatarLink),
    };
  }
}
