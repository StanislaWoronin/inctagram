import { ApiProperty } from '@nestjs/swagger';
import { userConstants } from '../../users/user.constants';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsEmailExistForRegistration } from '../../../../libs/decorators/email.decorator';
import { IsUserNameExist } from '../../../../libs/decorators/user-name-exists.decorator';
import { TUser } from '../../users/entities/new-user.entity';
import { IsDifferentPassword } from '../../../../libs/decorators/different-password.decorator';

type TRegistrationDto = Pick<
  TUser,
  'email' | 'userName' | 'password' | 'passwordConfirmation'
>;

export class RegistrationDto implements TRegistrationDto {
  @ApiProperty({
    example: 'somemail@mail.com',
    description: 'User`s email',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  @IsEmailExistForRegistration()
  email: string;

  @ApiProperty({
    example: 'UserLogin',
    description: 'User`s login',
    minLength: userConstants.nameLength.min,
    maxLength: userConstants.nameLength.max,
  })
  @IsNotEmpty()
  @IsString()
  @Matches('^[0-9A-Za-z_\\-]+$')
  @Transform(({ value }) => value?.trim())
  @Length(userConstants.nameLength.min, userConstants.nameLength.max)
  @IsUserNameExist()
  userName: string;

  @ApiProperty({
    example: 'qwerty123',
    description: 'User`s password',
    minLength: userConstants.passwordLength.min,
    maxLength: userConstants.passwordLength.max,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!"#$%&\'()*+,-.:;<=>?@[\\]^_`{|}~])(?!.*\\s)',
  )
  @Transform(({ value }) => value?.trim())
  @Length(userConstants.passwordLength.min, userConstants.passwordLength.max)
  password: string;

  @ApiProperty({ example: 'qwerty123' })
  @IsString()
  @IsDifferentPassword()
  passwordConfirmation: string;
}
