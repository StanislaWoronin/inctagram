import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { userConstants } from '../../users/user.constants';
import { IsRecoveryCodeExist } from '../../../../libs/decorators/recovery-code.decorator';
import { TUser } from '../../users/entities/new-user.entity';
import { PasswordRecovery } from '../../users/entities/password-recovery.entity';
import { IsDifferentPassword } from '../../../../libs/decorators/different-password.decorator';

type TNewPasswordDto = Pick<TUser, 'passwordConfirmation'> &
  Pick<PasswordRecovery, 'passwordRecoveryCode'> & { newPassword: string };

export class NewPasswordDto implements TNewPasswordDto {
  @ApiProperty({
    description: 'New password',
    example: 'newPassword',
    minLength: userConstants.passwordLength.min,
    maxLength: userConstants.passwordLength.max,
  })
  @IsString()
  @Length(userConstants.passwordLength.min, userConstants.passwordLength.max)
  newPassword: string;

  @ApiProperty({
    description: "User's new password confirmation field.",
    example: 'newPassword',
  })
  @IsString()
  @IsDifferentPassword()
  passwordConfirmation: string;

  @ApiProperty({ description: 'Password recovery code' })
  @IsString()
  @IsRecoveryCodeExist()
  passwordRecoveryCode: string;
}
