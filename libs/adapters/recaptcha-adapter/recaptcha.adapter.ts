import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecaptchaAdapter {
  constructor(private configService: ConfigService) {}

  private secret = this.configService.get('RECAPTCHA_SECRET');
  private recaptchaUrl = this.configService.get('RECAPTCHA_URL');

  async isValid(value) {
    const result = await fetch(this.recaptchaUrl, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      body: `secret=${this.secret}&response=${value}`,
    });

    const response: TRecaptchaResponse = await result.json();
    return response.success;
  }
}

type TRecaptchaResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  'error-codes': any[];
  score: number;
};
