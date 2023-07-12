import { settings } from '../../../../libs/shared/settings';
import { EmailConfirmation as TEmailConfirmation } from '@prisma/client';

export class EmailConfirmation implements TEmailConfirmation {
  userId: string;
  confirmationCode: string = (
    Date.now() + settings.timeLife.CONFIRMATION_CODE
  ).toString();

  static async create() {
    return new EmailConfirmation();
  }
}
