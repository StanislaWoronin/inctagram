import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsEmailForPasswordRecoveryExist } from '../../../../libs/decorators/email.decorator';
import { User } from '@prisma/client';

type TEmailDto = Pick<User, 'email'>;

export class EmailDto implements TEmailDto {
  @ApiProperty()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  @IsEmailForPasswordRecoveryExist()
  email: string;
}
