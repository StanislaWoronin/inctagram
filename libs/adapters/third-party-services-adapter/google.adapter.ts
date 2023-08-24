import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GitHubUserDto } from '../../../apps/main-app/auth/dto/git-hub-user.dto';
import { switchRedirectUrl } from './switch-redirect-url';
import axios from 'axios';
import * as queryString from 'querystring';
import { IGoogleTokens } from './types/google-tokens.interface';
import { GoogleUserDto } from '../../../apps/main-app/auth/dto/google-user.dto';
import { mainAppConfig } from '../../../apps/main-app/main';
import { authEndpoints } from '../../shared/endpoints/auth.endpoints';

@Injectable()
export class GoogleAdapter {
  constructor(private configService: ConfigService) {}

  private clientId = this.configService.get('GOOGLE_CLIENT_ID');
  private clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
  private redirectUrl = switchRedirectUrl();

  async getGoogleOAuthTokens(code: string): Promise<IGoogleTokens> {
    const url = 'https://oauth2.googleapis.com/token';

    const values = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: `${
        mainAppConfig.appUrl
      }/${authEndpoints.default()}/${authEndpoints.registrationViaGoogle()}`,
      grant_type: 'authorization_code',
    };

    try {
      const response = await axios.post(url, queryString.stringify(values), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
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

      return response.data;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
}
