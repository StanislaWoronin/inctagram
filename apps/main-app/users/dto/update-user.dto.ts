import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsNotEmpty, IsOptional, IsString, Length, MaxLength,} from 'class-validator';
import {userConstants} from '../user.constants';
import {User} from '@prisma/client';
import {IsUserNameExist} from '../../../../libs/decorators/user-name.decorator';
import {IsValidBirthdayFormat} from '../../../../libs/decorators/birthday-format.decorator';

type TUpdateUserProfileDto = Pick<
  User,
  'userName' | 'firstName' | 'lastName' | 'birthday' | 'city' | 'aboutMe'
>;

export class UpdateUserProfileDto implements TUpdateUserProfileDto {
  @ApiProperty({
    example: 'UserLogin',
    description: 'User`s login',
    minLength: userConstants.nameLength.min,
    maxLength: userConstants.nameLength.max,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(userConstants.nameLength.min, userConstants.nameLength.max)
  @IsUserNameExist()
  userName: string;

  @ApiProperty({
    maxLength: userConstants.firstNameLength.max,
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @MaxLength(userConstants.firstNameLength.max)
  firstName: string;

  @ApiProperty({
    maxLength: userConstants.lastNameLength.max,
    required: true,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @MaxLength(userConstants.lastNameLength.max)
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsValidBirthdayFormat()
  birthday: Date;

  @ApiProperty({
    maxLength: userConstants.cityLength.max,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @MaxLength(userConstants.cityLength.max)
  city: string;

  @ApiProperty({
    maxLength: userConstants.aboutMeLength.max,
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MaxLength(userConstants.aboutMeLength.max)
  aboutMe: string;
}
