import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { UserThirdPartyServicesDto } from '../../../apps/main-app/auth/dto/user-third-party-services.dto';

@Injectable()
export class GoogleAdapter {
  oauthClient: Auth.OAuth2Client;
  constructor(private configService: ConfigService) {}

  private clientId = this.configService.get('GOOGLE_CLIENT_ID');
  private clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
  private redirectUrl = this.configService.get('GOOGLE_REDIRECT_URL');

  init() {
    this.oauthClient = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUrl,
    );
  }

  async loginGoogleUser(token: string): Promise<UserThirdPartyServicesDto> {
    try {
      console.log(token);
      console.log(this.clientId, this.clientSecret, this.redirectUrl);
      const data = await this.oauthClient.getToken(token);
      console.log({ tokens: data });
      const user: Auth.LoginTicket = await this.oauthClient.verifyIdToken({
        idToken: data.tokens.id_token,
      });
      const currenUser = user.getPayload();

      return {
        email: currenUser.email,
        avatarUrl: currenUser.picture,
        name: currenUser.name,
      };
    } catch (e) {
      console.log(e);
    }
  }
}
