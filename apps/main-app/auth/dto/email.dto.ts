import {ApiProperty} from '@nestjs/swagger';
import {IsEmail} from 'class-validator';
import {Transform} from 'class-transformer';
import {User} from '@prisma/client';

type TEmailDto = Pick<User, 'email'>;

export class EmailDto implements TEmailDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  //@IsEmailForPasswordRecoveryExist()
  email: string;
}
