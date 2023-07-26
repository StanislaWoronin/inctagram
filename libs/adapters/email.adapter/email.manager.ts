import { Injectable } from '@nestjs/common';
import { EmailAdapters } from './email.adapter';
import { magicLink } from '../../shared/meme';

@Injectable()
export class EmailManager {
  constructor(protected emailAdapters: EmailAdapters) {}

  async sendConfirmationEmail(
    email: string,
    confirmationCode: string,
  ): Promise<void> {
    const subject = 'Confirm your email';
    const message = `
      <h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
        <a href=\'https://inctagram-api.fly.dev/auth/registration-confirmation?confirmationCode=${confirmationCode}\'>${magicLink()}</a>
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

  async sendRefinementEmail(email: string): Promise<void> {
    const subject = 'Log in to the system.';
    const message = `
      <p>The user with this email is already registered.
         If it's you, then follow the link:
         <a href='http://localhost:3000/ru/merge?email:email'>${magicLink()}</a>   
      </p>
    `;

    return this.emailAdapters.sendEmail(email, subject, message);
  }

  async sendPasswordRecoveryEmail(email: string, recoveryCode: string) {
    const subject = 'Password recovery';
    const message = `
      <h1>Password recovery</h1>
      <p>To finish password recovery please follow the link below:
        <a href='http://localhost:3000/ru?recoveryCode=${recoveryCode}'>${magicLink()}</a>
      </p>
    `;

    return this.emailAdapters.sendEmail(email, subject, message);
  }
}
