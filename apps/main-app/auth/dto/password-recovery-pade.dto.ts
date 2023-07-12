import { ApiProperty } from '@nestjs/swagger';

type TPasswordRecoveryPageDto = Pick<PasswordRecoveryPageDto, 'recoveryCode'>;

export class PasswordRecoveryPageDto implements TPasswordRecoveryPageDto {
  @ApiProperty()
  recoveryCode: string;
}
