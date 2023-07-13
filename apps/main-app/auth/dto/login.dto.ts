import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { userConstants } from '../../users/user.constants';
import { IsEmailExist } from '../../../../libs/decorators/email.decorator';
import { TUser } from '../../users/entities/new-user.entity';

type TLoginDto = Pick<TUser, 'email' | 'password'>;

export class LoginDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsEmailExist()
  email: string;

  @ApiProperty({
    minLength: userConstants.passwordLength.min,
    maxLength: userConstants.passwordLength.max,
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @Length(userConstants.passwordLength.min, userConstants.passwordLength.max)
  password: string;
}
