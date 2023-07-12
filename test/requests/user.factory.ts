import { AuthRequest } from './auth.request';
import { UserWithTokensType } from '../types/user-with-tokens.type';
import {
  preparedLoginData,
  preparedRegistrationData,
} from '../prepared-data/prepared-auth.data';
import { Testing } from './testing.request';
import { faker } from '@faker-js/faker';
import request from 'supertest';
import { ViewUser } from '../../apps/main-app/users/view-model/user.view-model';
import { RegistrationDto } from '../../apps/main-app/auth/dto/registration.dto';
import { LoginDto } from '../../apps/main-app/auth/dto/login.dto';
import { authEndpoints } from '../../libs/shared/endpoints/auth.endpoints';

export class UserFactory {
  constructor(
    private readonly server: any,
    private readonly authRequest: AuthRequest,
    private readonly testingRequest: Testing,
  ) {}

  async createUsers(usersCount: number, startWith = 0): Promise<ViewUser[]> {
    const result = [];
    for (let i = 0; i < usersCount; i++) {
      const inputData: RegistrationDto = {
        userName: `UserLogin${i + startWith}`,
        email: `somemail${i + startWith}@gmail.com`,
        password: 'qwerty123',
        passwordConfirmation: 'qwerty123',
      };

      const response = await this.authRequest.registrationUser(inputData);

      result.push(response.body);
    }

    return result;
  }

  async createAndLoginUsers(
    userCount: number,
    startWith = 0,
  ): Promise<UserWithTokensType[]> {
    const users = await this.createUsers(userCount, startWith);

    const result = [];
    for (let i = 0; i < userCount; i++) {
      const createdUser = await this.testingRequest.getUser(users[i].id);

      await this.authRequest.confirmRegistration(
        createdUser.EmailConfirmation.confirmationCode,
      );

      const userLoginData: LoginDto = {
        email: createdUser.email,
        password: preparedRegistrationData.valid.password,
      };

      const response = await this.authRequest.loginUser(userLoginData);

      result.push({
        user: users[i],
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    }

    return result;
  }

  async createAndLoginOneUserManyTimes(
    loginCount: number,
  ): Promise<UserWithTokensType> {
    const [user] = await this.createAndLoginUsers(1);
    const userWithTokens = {
      user: user.user,
      accessToken: null,
      refreshToken: null,
    };

    const userLoginData = {
      email: user.user.email,
      password: preparedLoginData.valid.password,
    };

    for (let i = 0; i < loginCount - 1; i++) {
      const response = await request(this.server)
        .post(authEndpoints.login(true))
        .set('User-Agent', faker.internet.userAgent())
        .send(userLoginData);

      userWithTokens.accessToken = response.body.accessToken;
      userWithTokens.refreshToken = response.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];
    }

    return userWithTokens;
  }
}
