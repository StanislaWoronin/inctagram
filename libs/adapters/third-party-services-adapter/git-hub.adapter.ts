import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GitHubUserDto } from '../../../apps/main-app/auth/dto/git-hub-user.dto';
import { mainAppConfig } from '../../../apps/main-app/main';
import { Language } from '../../decorators/metadata.decorator';

@Injectable()
export class GitHubAdapter {
  constructor(private configService: ConfigService) {}

  private gitHubAT = 'https://github.com/login/oauth/access_token';
  private clientId = this.configService.get('GITHUB_CLIENT_ID');
  private clientSecret = this.configService.get('GITHUB_CLIENT_SECRET');

  async validate(code: string, language: Language) {
    const requestData = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: `${mainAppConfig.clientUrl}/${language}/auth/oauth-github-client`,
    };

    const response = await axios.post(this.gitHubAT, requestData, {
      headers: { Accept: 'application/json' },
    });
    if ('error' in response.data) {
      throw new UnauthorizedException(response.data.error_description);
    }
    return response.data;
  }

  async getUserByToken(token): Promise<GitHubUserDto> {
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
      id: String(user.id),
      avatarUrl: user.avatar_url,
      name: user.login,
      email,
    };
  }
}
