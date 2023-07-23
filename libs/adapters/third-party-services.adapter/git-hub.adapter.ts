import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { GitHubUserDto } from '../../../apps/main-app/auth/dto/git-hub-user.dto';

@Injectable()
export class GitHubAdapter {
  constructor(private configService: ConfigService) {}

  private gitHubAT = this.configService.get('GITHUB_ACCESS_TOKEN');
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
      console.log('-> error', response.data);
    }
    console.log('GitHubAdapter.validate:', response.data);
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
    console.log('GitHubAdapter.getUserByToken:', { userRes }, { emailRes });
    const user = userRes.data;
    const { email } = emailRes.data.find((emailObj: any) => emailObj.primary);

    return {
      avatarUrl: user.avatar_url,
      name: user.name,
      email,
    };
  }
}
