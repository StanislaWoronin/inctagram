import { ApiProperty } from '@nestjs/swagger';
import { EmailConfirmation } from '@prisma/client';

type TRegistrationConfirmationDto = Pick<EmailConfirmation, 'confirmationCode'>;

export class RegistrationConfirmationDto
  implements TRegistrationConfirmationDto
{
  @ApiProperty({ description: 'Registration confirmation code' })
  //@IsConfirmationCodeExist()
  confirmationCode: string;
}
