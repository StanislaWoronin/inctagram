import {Injectable, UnauthorizedException} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { GitHubUserDto } from '../../../apps/main-app/auth/dto/git-hub-user.dto';
import {switchRedirectUrl} from "./switch-redirect-url";
import axios from "axios";
import * as queryString from "querystring";
import {IGoogleTokens} from "./types/google-tokens.interface";
import {GoogleUserDto} from "../../../apps/main-app/auth/dto/google-user.dto";

@Injectable()
export class GoogleAdapter {
  oauthClient: Auth.OAuth2Client;
  constructor(private configService: ConfigService) {}

  private clientId = this.configService.get('GOOGLE_CLIENT_ID');
  private clientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
  private redirectUrl = switchRedirectUrl();

  init() {
    this.oauthClient = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUrl,
    );
  }

  async loginGoogleUser(token: string): Promise<GitHubUserDto> {
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

  async getGoogleOAuthTokens(code: string): Promise<IGoogleTokens> {
    const url = 'https://oauth2.googleapis.com/token'

    const values = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUrl,
      grant_type: 'authorization_code'
    }

    try {
      const response = await axios.post(url, queryString.stringify(values), {
            headers: {
              "Content-Type": 'application/x-www-form-urlencoded'
            }
          })

      return response.data
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException()
    }
  }

  async getGoogleUser({id_token, access_token}): Promise<GoogleUserDto> {
    try {
      const url = `https://oauth2.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      })

      return response.data
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException()
    }
  }

  async
}
