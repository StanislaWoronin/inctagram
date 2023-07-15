import { ApiProperty } from '@nestjs/swagger';
import { IsConfirmationCodeExist } from '../../../../libs/decorators/confirmation-code.decorator';
import { EmailConfirmation } from '@prisma/client';
import { IsNumber } from 'class-validator';

type TRegistrationConfirmationDto = Pick<EmailConfirmation, 'confirmationCode'>;

export class RegistrationConfirmationDto
  implements TRegistrationConfirmationDto
{
  @ApiProperty({ description: 'Registration confirmation code' })
  //@IsConfirmationCodeExist()
  confirmationCode: string;
}
