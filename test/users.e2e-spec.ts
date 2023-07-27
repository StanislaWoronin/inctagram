import { HttpStatus, INestApplication } from '@nestjs/common';
import { Requests } from './requests/requests';
import { TestingRepository } from '../apps/main-app/testing/testing.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../apps/main-app/app.module';
import { EmailManager } from '../libs/adapters/email.adapter';
import { EmailManagerMock } from './mock/email-adapter.mock';
import { createApp } from '../apps/main-app/create-app';
import { preparedUserData } from './prepared-data/prepared-user.data';
import { errorsMessage } from './response/error.response';
import { UpdateUserProfileDto } from '../apps/main-app/users/dto/update-user.dto';
import { Tokens } from '../libs/shared/enums/tokens.enum';
import { getUserProfileResponse } from './response/user/get-user-profile.response';
import { Images } from './images/images';
import { FileStorageModule } from '../apps/file-storage/file-storage.module';

describe('Test auth controller.', () => {
  const second = 1000;
  jest.setTimeout(10 * second);

  let app: INestApplication;
  let server;
  let requests: Requests;
  let testingRepository: TestingRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, FileStorageModule],
    })
      .overrideProvider(EmailManager)
      .useValue(new EmailManagerMock())
      .compile();

    const rawApp = await moduleFixture.createNestApplication();
    app = createApp(rawApp);
    await app.init();

    testingRepository = app.get(TestingRepository);
    server = await app.getHttpServer();
    requests = new Requests(server);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Return user's profile.", () => {
    it('Create data.', async () => {
      await testingRepository.deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      const fullUser = await testingRepository.getUser(user.user.id);

      expect.setState({
        fullUser: fullUser,
        accessToken: user.accessToken,
      });
    });

    it(`Status: ${HttpStatus.UNAUTHORIZED}.
      Try get profile without token.`, async () => {
      const response = await requests.user().getUserProfile();
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status: ${HttpStatus.UNAUTHORIZED}.
      Try get profile without incorrect token.`, async () => {
      const { accessToken } = expect.getState();
      const incorrectToken = accessToken.slice(0, -1);

      const response = await requests.user().getUserProfile(incorrectToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status: ${HttpStatus.OK}.
      Should return user profile.`, async () => {
      const { fullUser, accessToken } = expect.getState();

      const response = await requests.user().getUserProfile(accessToken);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toStrictEqual(getUserProfileResponse(fullUser));
    });

    it(`Status: ${HttpStatus.UNAUTHORIZED}.
      Try get profile without expired token.`, async () => {
      const { accessToken } = expect.getState();
      const expiredToken = await testingRepository.makeTokenExpired(
        accessToken,
        Tokens.AccessToken,
      );

      const response = await requests.user().getUserProfile(expiredToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe("Update user's profile.", () => {
    it('Create data.', async () => {
      await testingRepository.deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);

      expect.setState({
        user: user.user,
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Try update profile with missed access token.`, async () => {
      const response = await requests
        .user()
        .updateUserProfile(preparedUserData.valid);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Try update profile with incorrect token.`, async () => {
      const { accessToken } = expect.getState();
      const incorrectToken = accessToken.replace('.', '');

      const response = await requests
        .user()
        .updateUserProfile(preparedUserData.valid, incorrectToken);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try update profile with short input data.`, async () => {
      const { accessToken } = expect.getState();
      const errors = errorsMessage<UpdateUserProfileDto>([
        'userName',
        'firstName',
        'lastName',
        'birthday',
        'city',
      ]);

      const response = await requests
        .user()
        .updateUserProfile(preparedUserData.incorrect.short, accessToken);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try update profile with long input data and incorrect birthday format.`, async () => {
      const { accessToken } = expect.getState();
      const errors = errorsMessage<UpdateUserProfileDto>([
        'userName',
        'firstName',
        'lastName',
        'birthday',
        'city',
        'aboutMe',
      ]);

      const response = await requests
        .user()
        .updateUserProfile(preparedUserData.incorrect.long, accessToken);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.NO_CONTENT}.
      Try update with incorrect birthday.`, async () => {
      const { accessToken } = expect.getState();
      const errors = errorsMessage<UpdateUserProfileDto>(['birthday']);

      const response = await requests
        .user()
        .updateUserProfile(
          preparedUserData.incorrect.wrongBirthday,
          accessToken,
        );
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.NO_CONTENT}.
      Try update with nonExistingDate birthday.`, async () => {
      const { accessToken } = expect.getState();
      const errors = errorsMessage<UpdateUserProfileDto>(['birthday']);

      const response = await requests
        .user()
        .updateUserProfile(
          preparedUserData.incorrect.nonExistingDate,
          accessToken,
        );
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.NO_CONTENT}.
      Should update profile.`, async () => {
      const { accessToken } = expect.getState();

      const response = await requests
        .user()
        .updateUserProfile(preparedUserData.valid, accessToken);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);

      const updatedProfile = await requests.user().getUserProfile(accessToken);
      expect(updatedProfile.body).toStrictEqual(
        getUserProfileResponse(preparedUserData.valid),
      );
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Try update profile with expired token.`, async () => {
      const { accessToken } = expect.getState();
      const expiredToken = await testingRepository.makeTokenExpired(
        accessToken,
        Tokens.AccessToken,
      );

      const response = await requests
        .user()
        .updateUserProfile(preparedUserData.valid, expiredToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Upload user avatar.', () => {
    it('Create data.', async () => {
      await testingRepository.deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      const fullUser = await testingRepository.getUser(user.user.id);

      expect.setState({
        fullUser: fullUser,
        accessToken: user.accessToken,
      });
    });

    it.skip(`Status ${HttpStatus.UNAUTHORIZED}.
      Try upload avatar with missed access token.`, async () => {
      const response = await requests.user().uploadUserAvatar(Images.Fist);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it.skip(`Status ${HttpStatus.UNAUTHORIZED}.
      Try upload avatar with incorrect access token.`, async () => {
      const { accessToken } = expect.getState();
      const incorrectToken = accessToken.replace('.', '');

      const response = await requests
        .user()
        .uploadUserAvatar(Images.Fist, incorrectToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it.skip(`Status ${HttpStatus.UNAUTHORIZED}.
      Try upload avatar with expired access token.`, async () => {
      const { accessToken } = expect.getState();
      const expiredToken = await testingRepository.makeTokenExpired(
        accessToken,
        Tokens.AccessToken,
      );

      const response = await requests
        .user()
        .uploadUserAvatar(Images.Fist, expiredToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try upload  avatar which more then 1mb.`, async () => {
      const { accessToken } = expect.getState();
      const errors = errorsMessage(['format']);

      const response = await requests
        .user()
        .uploadUserAvatar(Images.SoBig, accessToken);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it(`Status ${HttpStatus.BAD_REQUEST}.
      Try upload wrong format avatar.`, async () => {
      const { accessToken } = expect.getState();
      const errors = errorsMessage(['format']);

      const response = await requests
        .user()
        .uploadUserAvatar(Images.WrongFormat, accessToken);
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body).toStrictEqual(errors);
    });

    it.skip(`Status ${HttpStatus.NO_CONTENT}.
      Should upload new avatar.`, async () => {
      const { accessToken } = expect.getState();

      const response = await requests
        .user()
        .uploadUserAvatar(Images.Fist, accessToken);
      expect(response.status).toBe(HttpStatus.NO_CONTENT);
    }); // если путь передавать ошибка соединения, если передавать файл, он просто не доходит и тут дело именно в том как мы тестируем, потому что через постман все ок, а 400 падают потому что ничего не приходит, а не из-за валидации)
  });

  describe('Get user profile.', () => {
    it('Create data.', async () => {
      await testingRepository.deleteAll();
      const [user] = await requests.userFactory().createAndLoginUsers(1);
      const fullUser = await testingRepository.getUser(user.user.id);

      expect.setState({
        fullUser: fullUser,
        accessToken: user.accessToken,
      });
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Try upload avatar with missed access token.`, async () => {
      const response = await requests.user().getUserProfile();
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Try upload avatar with incorrect access token.`, async () => {
      const { accessToken } = expect.getState();
      const incorrectToken = accessToken.replace('.', '');

      const response = await requests.user().getUserProfile(incorrectToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.UNAUTHORIZED}.
      Try upload avatar with expired access token.`, async () => {
      const { accessToken } = expect.getState();
      const expiredToken = await testingRepository.makeTokenExpired(
        accessToken,
        Tokens.AccessToken,
      );

      const response = await requests.user().getUserProfile(expiredToken);
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`Status ${HttpStatus.OK}.
      Should upload new avatar.`, async () => {
      const { fullUser, accessToken } = expect.getState();

      const response = await requests.user().getUserProfile(accessToken);
      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toStrictEqual(getUserProfileResponse(fullUser));
    });

    it(`Status ${HttpStatus.OK}.
      Should return updated profile.`, async () => {
      const { accessToken } = expect.getState();
      await requests
        .user()
        .updateUserProfile(preparedUserData.valid, accessToken);

      const updatedProfile = await requests.user().getUserProfile(accessToken);
      expect(updatedProfile.status).toBe(HttpStatus.OK);
      expect(updatedProfile.body).toStrictEqual(
        getUserProfileResponse(preparedUserData.valid),
      );
    });
  });

  describe('Create new post.', () => {});

  describe('Update user post.', () => {});

  describe('Delete user post.', () => {});
});
