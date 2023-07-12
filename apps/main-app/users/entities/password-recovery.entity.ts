import { settings } from '../../../../libs/shared/settings';
import { PasswordRecovery as TPasswordRecovery } from '@prisma/client';

export class PasswordRecovery implements TPasswordRecovery {
  userId: string;
  passwordRecoveryCode: string = (
    Date.now() + settings.timeLife.PASSWORD_RECOVERY_CODE
  ).toString();

  static create(userId: string) {
    const passwordRecovery = new PasswordRecovery();
    passwordRecovery.userId = userId;

    return passwordRecovery;
  }
}
