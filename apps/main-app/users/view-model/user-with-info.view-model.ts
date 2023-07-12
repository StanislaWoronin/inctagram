import { ApiProperty } from '@nestjs/swagger';
import { ViewUser } from './user.view-model';
import { User } from '@prisma/client';

type TUserInfo = Pick<User, 'firstName' | 'lastName' | 'city' | 'aboutMe'> & {
  birthday: string;
};

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
  linkToMainImage: string | null;
}
