import request from 'supertest';
import { TestResponseType } from '../types/test-response.type';
import { faker } from '@faker-js/faker';
import { TLoginResponse } from '../types/login.type';
import { HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../../libs/shared/errors.response';
import { ViewUser } from '../../apps/main-app/users/view-model/user.view-model';
import { RegistrationDto } from '../../apps/main-app/auth/dto/registration.dto';
import { LoginDto } from '../../apps/main-app/auth/dto/login.dto';
import { authEndpoints } from '../../libs/shared/endpoints/auth.endpoints';

export class AuthRequest {
  constructor(private readonly server: any) {}

  async registrationUser(
    registrationUserDto: RegistrationDto,
  ): Promise<TestResponseType<ViewUser>> {
    const response = await request(this.server)
      .post(authEndpoints.registration(true))
      .send(registrationUserDto);

    return { body: response.body, status: response.status };
  }

  async loginUser(loginUserDto: LoginDto): Promise<Partial<TLoginResponse>> {
    const response = await request(this.server)
      .post(authEndpoints.login(true))
      .set('User-Agent', faker.internet.userAgent())
      .send(loginUserDto);

    if (response.status !== HttpStatus.OK) {
      return {
        status: response.status,
      };
    }

    return {
      accessToken: response.body.accessToken,
      refreshToken: response.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1],
      status: response.status,
    };
  }

  async resendingConfirmationCode(
    email: string,
  ): Promise<TestResponseType<ErrorResponse>> {
    const response = await request(this.server)
      .post(authEndpoints.confirmationEmailResending(true))
      .send({ email: email });

    return { body: response.body, status: response.status };
  }

  async confirmRegistration(
    code: string,
  ): Promise<TestResponseType<ErrorResponse>> {
    const response = await request(this.server)
      .get(`${authEndpoints.registrationConfirmation(true)}?confirmationCode=${code}`);

    return { body: response.body, status: response.status };
  }

  async sendPasswordRecovery(
    email: string,
  ): Promise<TestResponseType<ErrorResponse>> {
    const response = await request(this.server)
      .post(authEndpoints.passwordRecovery(true))
      .send({ email });

    return { body: response.body, status: response.status };
  }

  async newPassword(
    code: string,
    password: string,
    passwordConfirmation: string = password,
  ): Promise<TestResponseType<ErrorResponse>> {
    const response = await request(this.server)
      .post(authEndpoints.newPassword(true))
      .send({
        newPassword: password,
        passwordConfirmation: passwordConfirmation,
        passwordRecoveryCode: code,
      });

    return { body: response.body, status: response.status };
  }

  async updatePairTokens(
    refreshToken?: string,
  ): Promise<Partial<TLoginResponse>> {
    const response = await request(this.server)
      .post(authEndpoints.pairToken(true))
      .set('Cookie', `refreshToken=${refreshToken}`)
      .set('User-Agent', faker.internet.userAgent());

    if (response.status !== HttpStatus.OK) {
      return {
        status: response.status,
      };
    }

    return {
      accessToken: response.body,
      refreshToken: response.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1],
      status: response.status,
    };
  }

  async logout(refreshToken?: string): Promise<number> {
    const response = await request(this.server)
      .post(authEndpoints.logout(true))
      .set('Cookie', `refreshToken=${refreshToken}`);

    return response.status;
  }
}
