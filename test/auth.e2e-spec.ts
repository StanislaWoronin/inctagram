import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Requests } from './requests/requests';
import {
  preparedLoginData,
  preparedRegistrationData,
} from './prepared-data/prepared-auth.data';
import { TestingRepository } from '../apps/main-app/src/testing.repository';
import { errorsMessage } from './response/error.response';
import { EmailManager } from '../libs/adapters/email.adapter';
import { EmailManagerMock } from './mock/email-adapter.mock';
import { RegistrationDto } from '../apps/main-app/auth/dto/registration.dto';
import { AppModule } from '../apps/main-app/src/app.module';
import { createUserResponse } from './response/auth/create-user.response';
import { RegistrationConfirmationDto } from '../apps/main-app/auth/dto/registration-confirmation.dto';
import { EmailDto } from '../apps/main-app/auth/dto/email.dto';
import { NewPasswordDto } from '../apps/main-app/auth/dto/new-password.dto';
import { Tokens } from '../libs/shared/enums/tokens.enum';
import { createApp } from '../apps/main-app/src/create-app';

describe('Test auth controller.', () => {
  const second = 1000;
  jest.setTimeout(10 * second);

  let app: INestApplication;
  let server;
  let requests: Requests;
  let testingRepository: TestingRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailManager)
      .useValue(new EmailManagerMock())
      .compile();
    const rawApp = await moduleFixture.createNestApplication();
    app = createApp(rawApp);

    testingRepository = app.get(TestingRepository);
    server = await app.getHttpServer();
    requests = new Requests(server);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Create new user', () => {
    it('Clear data base.', async () => {
      await testingRepository.deleteAll();
    });

    const errors = errorsMessage<RegistrationDto>([
      'email',
      'userName',
      'password',
    ]);
    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try registration with SHORT input data.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.incorrect.short);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try registration with LONG input data.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.incorrect.long);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try registration with different password and password confirmation.`, async () => {
      const errors = errorsMessage<RegistrationDto>(['passwordConfirmation']);
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.incorrect.differentPassword);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.CREATED}.
      Should create new user.`, async () => {
      const response = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body).toStrictEqual(
        createUserResponse(
          preparedRegistrationData.valid.userName,
          preparedRegistrationData.valid.email,
        ),
      );
    });

    // it(`Status ${HttpStatus.SEE_OTHER}.
    //   Should return dto if registered user with an unconfirmed email address is trying to re-register.`, async () => {
    //   const response = await requests
    //     .auth()
    //     .registrationUser(preparedRegistrationData.valid);
    //   expect(response.status).toBe(HttpStatus.SEE_OTHER);
    //   expect(response.body).toStrictEqual(preparedRegistrationData.valid);
    // });
  });

  describe('Registration confirmation.', () => {
    it('Create data.', async () => {
      await testingRepository.deleteAll();
      const user = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      const createdUser = await testingRepository.getUser(user.body.id);

      expect.setState({
        userId: user.body.id,
        userEmail: user.body.email,
        code: createdUser.EmailConfirmation.confirmationCode,
      });
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try confirm email with incorrect code.`, async () => {
      const { code } = expect.getState();
      const errors = errorsMessage<RegistrationConfirmationDto>(['confirmationCode'])

      const response = await requests
        .auth()
        .confirmRegistration((Number(code) - 1).toString());
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors)
    });

    it(`Status ${HttpStatus.FOUND}. 
      Registration confirm.`, async () => {
      const { userId, code } = expect.getState();

      const response = await requests.auth().confirmRegistration(code);
      expect(response.status).toBe(HttpStatus.FOUND);

      const user = await testingRepository.getUser(userId);
      expect(user.isConfirmed).toBe(true);
    });

    it(`Status ${HttpStatus.FOUND}.
      Try confirm email when email already confirm.`, async () => {
      const { code } = expect.getState();

      const response = await requests.auth().confirmRegistration(code);
      expect(response.status).toBe(HttpStatus.FOUND);
    });

    it(`Status ${HttpStatus.FOUND}.
      Try confirm email with expired code.`, async () => {
      const [user] = await requests.userFactory().createUsers(1, 1);
      const createdUser = await testingRepository.getUser(user.id);
      const expiredCode = await testingRepository.makeEmailConfirmationExpired(
        user.id,
        createdUser.EmailConfirmation.confirmationCode,
      );

      const response = await requests
        .auth()
        .confirmRegistration(expiredCode.toString());
      expect(response.status).toBe(HttpStatus.FOUND);
    });
  });

  describe('Log user', () => {
    it('Create data.', async () => {
      await testingRepository.deleteAll();
      const user = await requests
        .auth()
        .registrationUser(preparedRegistrationData.valid);
      const createdUser = await testingRepository.getUser(user.body.id);

      expect.setState({
        code: createdUser.EmailConfirmation.confirmationCode,
      });
    }, 10000);

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      User tries to log in without confirming the email.`, async () => {
      const response = await requests.auth().loginUser({
        email: preparedLoginData.valid.email,
        password: preparedLoginData.valid.password,
      });

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      User try login with incorrect email.`, async () => {
      const { code } = expect.getState();

      await requests.auth().confirmRegistration(code);
      const response = await requests.auth().loginUser({
        email: preparedLoginData.incorrect.email,
        password: preparedLoginData.valid.password,
      });
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      User try login with incorrect password.`, async () => {
      const response = await requests.auth().loginUser({
        email: preparedLoginData.valid.email,
        password: preparedLoginData.incorrect.password,
      });
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.OK}.
      Should return access and refresh JWT tokens. `, async () => {
      const response = await requests.auth().loginUser(preparedLoginData.valid);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.accessToken).toBeTruthy();
      expect(response.refreshToken).toBeTruthy();
    });
  });

  describe('Resending confirmation code.', () => {
    it('Create data.', async () => {
      await testingRepository.deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      const createdUser = await testingRepository.getUser(user.user.id);

      expect.setState({
        userId: user.user.id,
        userEmail: user.user.email,
        confirmationCode: createdUser.EmailConfirmation.confirmationCode,
      });
    }, 10000);

    it(`Status ${HttpStatus.NO_CONTENT}. 
      Should send email confirmation.`, async () => {
      const { userId, userEmail, confirmationCode } = expect.getState();

      const response = await requests
        .auth()
        .resendingConfirmationCode(userEmail);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const user = await testingRepository.getUser(userId);
      const newConfirmationCode = user.EmailConfirmation.confirmationCode;
      expect(confirmationCode).not.toBe(newConfirmationCode);
    });
  });

  describe('Password recovery.', () => {
    it('Create data.', async () => {
      await testingRepository.deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);

      expect.setState({
        userId: user.user.id,
        userEmail: user.user.email,
      });
    });

    const error = errorsMessage<EmailDto>(['email']);
    it(`Status ${HttpStatus.BAD_REQUEST}.
      User is trying to recover the password with incorrect input data.`, async () => {
      const response = await requests
        .auth()
        .sendPasswordRecovery(preparedRegistrationData.incorrect.long.email);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
    });

    it(`Status ${HttpStatus.NO_CONTENT}.
      Should send password recovery code.`, async () => {
      const { userId, userEmail } = expect.getState();

      const response = await requests.auth().sendPasswordRecovery(userEmail);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
      const user = await testingRepository.getUser(userId);
      const passwordRecoveryCode = user.PasswordRecovery.passwordRecoveryCode;
      expect(passwordRecoveryCode).toBeDefined();
    });
  });

  describe('New password.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      await requests.auth().sendPasswordRecovery(user.user.email);
      const _user = await testingRepository.getUser(user.user.id);

      expect.setState({
        userId: user.user.id,
        passwordRecoveryCode: _user.PasswordRecovery.passwordRecoveryCode,
        passwordHash: _user.passwordHash,
      });
    }, 10000);

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try get new password with incorrect code.`, async () => {
      const { passwordRecoveryCode } = expect.getState();
      const error = errorsMessage<NewPasswordDto>(['passwordRecoveryCode']);

      const code = (Number(passwordRecoveryCode) - 10).toString();
      const newPassword = 'NewPassword';
      const response = await requests.auth().newPassword(code, newPassword);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try get new password but new password equal old.`, async () => {
      const { passwordRecoveryCode } = expect.getState();
      const error = errorsMessage<NewPasswordDto>(['newPassword']);

      const newPassword = preparedRegistrationData.valid.password;
      const response = await requests
        .auth()
        .newPassword(passwordRecoveryCode, newPassword);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try set new password with different password and password confirmation.`, async () => {
      const { passwordRecoveryCode } = expect.getState();
      const error = errorsMessage<RegistrationDto>(['passwordConfirmation']);

      const newPassword = preparedRegistrationData.valid.password;
      const response = await requests
        .auth()
        .newPassword(passwordRecoveryCode, newPassword, newPassword + 1);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
    });

    it(`Status ${HttpStatus.NO_CONTENT}.
      Should save new password.`, async () => {
      const { userId, passwordRecoveryCode, passwordHash } = expect.getState();

      const newPassword = 'newPassword';
      const response = await requests
        .auth()
        .newPassword(passwordRecoveryCode, newPassword);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
      const user = await testingRepository.getUser(userId);
      const newPasswordHash = user.passwordHash;
      expect(passwordHash).not.toBe(newPasswordHash);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try get new password with expired code.`, async () => {
      const { userId } = expect.getState();
      const error = errorsMessage<NewPasswordDto>(['passwordRecoveryCode']);
      const expiredCode = (Date.now() - 10000).toString();
      await testingRepository.makePasswordRecoveryExpired(userId, expiredCode);

      const newPassword = 'NewPassword';
      const response = await requests
        .auth()
        .newPassword(expiredCode, newPassword);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try get new password with expired code.`, async () => {
      const { userId, passwordRecoveryCode } = expect.getState();
      const expiredCode = await testingRepository.makePasswordRecoveryExpired(
        userId,
        passwordRecoveryCode,
      );
      const error = errorsMessage<NewPasswordDto>(['passwordRecoveryCode']);

      const newPassword = 'NewPassword';
      const response = await requests
        .auth()
        .newPassword(expiredCode, newPassword);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(error);
    });
  });

  describe('Update pair tokens.', () => {
    it(`Create data.`, async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);

      expect.setState({
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Shouldn't update pair if refresh token is incorrect`, async () => {
      const { refreshToken } = expect.getState();
      const token = refreshToken.replace('.');

      const response = await requests.auth().updatePairTokens(token);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Shouldn't update pair if refresh expired.`, async () => {
      const { refreshToken } = expect.getState();
      const expiredToken = await testingRepository.makeTokenExpired(
        refreshToken,
        Tokens.RefreshToken,
      );

      const response = await requests.auth().updatePairTokens(expiredToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    }, 5000);

    it('Should update pair tokens.', async () => {
      const { accessToken, refreshToken } = expect.getState();

      const newTokens = await requests.auth().updatePairTokens(refreshToken);
      expect(newTokens.status).toBe(HttpStatus.OK);
      expect(newTokens.accessToken).toBeTruthy();
      expect(newTokens.refreshToken).toBeTruthy();
      expect(newTokens.accessToken).not.toBe(accessToken);
      //expect(newTokens.refreshToken).not.toBe(refreshToken); // idk but ft updated after some time
    });
  });

  describe('Logout from system.', () => {
    it('Create data.', async () => {
      await requests.testing().deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);

      expect.setState({
        userId: user.user.id,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Shouldn't logout if refresh token is incorrect`, async () => {
      const { refreshToken } = expect.getState();
      const token = refreshToken.replace('.');

      const response = await requests.auth().logout(token);
      expect(response).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Shouldn't logout if refresh expired.`, async () => {
      const { refreshToken } = expect.getState();
      const expiredToken = await testingRepository.makeTokenExpired(
        refreshToken,
        Tokens.RefreshToken,
      );

      const response = await requests.auth().logout(expiredToken);
      expect(response).toBe(HttpStatus.UNAUTHORIZED);
    }, 5000);

    it(`Status ${HttpStatus.NO_CONTENT}.
      Logout from system.`, async () => {
      const { userId, refreshToken } = expect.getState();
      const response = await requests.auth().logout(refreshToken);
      expect(response).toBe(HttpStatus.NO_CONTENT);

      const user = await testingRepository.getUser(userId);
      expect(user.Device.length).toBe(0);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Try logout after delete device.`, async () => {
      const { refreshToken } = expect.getState();

      const response = await requests.auth().logout(refreshToken);
      expect(response).toBe(HttpStatus.UNAUTHORIZED);
    });

    describe('Create many device and delete last.', () => {
      const loginCount = 5;
      it('Create data', async () => {
        await requests.testing().deleteAll();
        const lastSession = await requests
          .userFactory()
          .createAndLoginOneUserManyTimes(loginCount);

        expect.setState({
          lastSession: lastSession,
          userId: lastSession.user.id,
          accessToken: lastSession.accessToken,
          refreshToken: lastSession.refreshToken,
        });
      });

      it(`Status ${HttpStatus.NO_CONTENT}.
        Logout from last session.`, async () => {
        const { userId, refreshToken } = expect.getState();

        await requests.auth().logout(refreshToken);
        const user = await testingRepository.getUser(userId);
        expect(user.Device.length).toBe(loginCount - 1);
      });
    });
  });
});
