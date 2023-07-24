import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { UserThirdPartyServicesDto } from '../../../apps/main-app/auth/dto/user-third-party-services.dto';
import { constraintToString } from 'class-validator/types/validation/ValidationUtils';

@Injectable()
export class GitHubAdapter {
  constructor(private configService: ConfigService) {}

  private gitHubAT = this.configService.get('GITHUB_REDIRECT_URL');
  private clientId = this.configService.get('GITHUB_CLIENT_ID');
  private clientSecret = this.configService.get('GITHUB_CLIENT_SECRET');

  async validate(code: string) {
    const requestData = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    };

    const response = await axios.post(this.gitHubAT, requestData, {
      headers: { Accept: 'application/json' },
    });
    if ('error' in response.data) {
      throw new UnauthorizedException(response.data.error_description);
    }
    return response.data;
  }

  async getUserByToken(token): Promise<UserThirdPartyServicesDto> {
    const [userRes, emailRes] = await Promise.all([
      axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${token.access_token}`,
        },
      }),
      axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${token.access_token}`,
        },
      }),
    ]);
    const user = userRes.data;
    const { email } = emailRes.data.find((emailObj: any) => emailObj.primary);

    return {
      avatarUrl: user.avatar_url,
      name: user.login,
      email,
    };
  }
}
