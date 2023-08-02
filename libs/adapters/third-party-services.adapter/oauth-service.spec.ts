import { OAuthService } from './oauth.service';
import { faker } from '@faker-js/faker';
import { ViewUser } from '../../../apps/main-app/users/view-model/user.view-model';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';

const dto = {
  name: 'UserName',
  email: 'somemail@gmail.com',
  avatarUrl: 'users/avatar.url',
  ipAddress: faker.internet.ip(),
  title: faker.internet.userAgent(),
};

const viewUser = ViewUser.toView({
  id: randomUUID(),
  userName: dto.name,
  email: dto.email,
  createdAt: new Date().toISOString(),
});

const emailManagerMock: any = {
  sendRefinementEmail: jest.fn(),
  sendCongratulationWithAuthEmail: jest.fn(),
};

const tokenFactoryMock: any = {
  getPairTokens: jest.fn().mockResolvedValue({
    accessToken: 'mockedAccessToken',
    refreshToken: 'mockedAccessToken',
  }),
};

const userRepositoryMock: any = {
  createUserViaThirdPartyServices: jest.fn().mockResolvedValue({
    ...viewUser,
  }),
};

const userQueryRepositoryMock: any = {
  getUserByField: jest
    .fn()
    .mockImplementationOnce(null)
    .mockImplementationOnce(() => {
      return {
        ...viewUser,
        isConfirmed: true,
      };
    })
    .mockImplementationOnce(() => {
      return {
        ...viewUser,
        isConfirmed: false,
      };
    }),
  getLastClientName: jest.fn().mockResolvedValue(null),
};

describe('Test OAuth service.', () => {
  const oAuthService = new OAuthService(
    emailManagerMock,
    tokenFactoryMock,
    userRepositoryMock,
    userQueryRepositoryMock,
  );

  it('User with this email not found and should create new account.', async () => {
    const result = await oAuthService.registerUser(dto);
    expect(result).toBeDefined();
    expect(result).toEqual({
      user: viewUser,
      accessToken: 'mockedAccessToken',
      refreshToken: 'mockedAccessToken',
    });
  });

  it('User with this email already and his account confirmed.', async () => {
    await expect(oAuthService.registerUser(dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('User with this email already exist but unconfirmed.', async () => {
    const result = await oAuthService.registerUser(dto);
    expect(result).toBe(null);
  });
});
