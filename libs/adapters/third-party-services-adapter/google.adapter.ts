import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as queryString from 'querystring';
import { IGoogleTokens } from './types/google-tokens.interface';
import { GoogleUserDto } from '../../../apps/main-app/auth/dto/google-user.dto';
import { mainAppConfig } from '../../../apps/main-app/main';

@Injectable()
export class GoogleAdapter {
  constructor(private configService: ConfigService) {}

  private clientId = this.configService.get('GOOGLE_CLIENT_ID');
  private clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');

  async getGoogleOAuthTokens(
    code: string,
    language: string,
  ): Promise<IGoogleTokens> {
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: `${mainAppConfig.clientUrl}/${language}/auth/oauth-google-client`,
      grant_type: 'authorization_code',
    };

    try {
      const { data } = await axios.post(url, queryString.stringify(values), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return data;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  async getGoogleUser({ id_token, access_token }): Promise<GoogleUserDto> {
    try {
      const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      });
      //console.log('2 - google-adapter: 56', response);
      return response.data;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
