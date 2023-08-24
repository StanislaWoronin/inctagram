import { Injectable } from '@nestjs/common';
import { EmailAdapters } from './email.adapter';
import { magicLink } from '../../shared/meme';
import { mainAppConfig } from '../../../apps/main-app/main';

@Injectable()
export class EmailManager {
  constructor(protected emailAdapters: EmailAdapters) {}

  async sendConfirmationEmail(
    email: string,
    confirmationCode: string,
    language: string,
  ): Promise<void> {
    const subject = 'Confirm your email';
    const link = `${mainAppConfig.clientUrl}/${language}/auth/registration/confirmation?confirmationCode=${confirmationCode}`;
    const message = `
      <h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
        <a href='${link}'>${magicLink()}</a>
      </p>
    `;

    return await this.emailAdapters.sendEmail(email, subject, message);
  }

  async sendCongratulationWithAuthEmail(email: string): Promise<void> {
    const subject = 'Congratulations!';
    const message = `
      <h1>Thank for your registration</h1>
      <p>Congratulations, you have successfully registered in Instagram!</p>
    `;

    return this.emailAdapters.sendEmail(email, subject, message);
  }

  async sendRefinementEmail(email: string, language: string): Promise<void> {
    const subject = 'Log in to the system.';
    const link = `${mainAppConfig.clientUrl}/${language}/auth/registration/merge?email:${email}`;
    const message = `
      <p>The user with this email is already registered.
         If it's you, then follow the link:
         <a href='${link}'>${magicLink()}</a>
      </p>
    `;

    return this.emailAdapters.sendEmail(email, subject, message);
  }

  async sendPasswordRecoveryEmail(
    email: string,
    recoveryCode: string,
    language: string,
  ) {
    const subject = 'Password recovery';
    const link = `${mainAppConfig.clientUrl}/${language}/auth/registration/recovery?recoveryCode=${recoveryCode}`;
    const message = `
      <h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
        <a href='${link}'>${magicLink()}</a>
      </p>
    `;

    return this.emailAdapters.sendEmail(email, subject, message);
  }
}
