import { MergeProfileCommandHandler } from './merge-profile.command-handler';
import { PrismaService } from '../../../../../../libs/providers/prisma/prisma.service';
import { UserRepository } from '../../../db.providers/user/user.repository';
import { faker } from '@faker-js/faker';
import { TestingRepository } from '../../../../testing/testing.repository';

const testUser = {
  userName: 'UserName',
  email: 'somemail@gmail.com',
  createdAt: new Date().toISOString(),
  isConfirmed: false,
};

const dto = {
  email: testUser.email,
  ipAddress: faker.internet.ip(),
  title: faker.internet.userAgent(),
};

const tokenFactoryMock: any = {
  getPairTokens: jest.fn().mockResolvedValue({
    accessToken: 'mockedAccessToken',
    refreshToken: 'mockedRefreshToken',
  }),
};

const jwtServiceMock: any = {};

describe('Merge profile.', () => {
  const prismaService = new PrismaService();
  const userRepository = new UserRepository(prismaService);
  const mergeProfileCommandHandler = new MergeProfileCommandHandler(
    tokenFactoryMock,
    userRepository,
  );

  const testingRepository = new TestingRepository(
    prismaService,
    jwtServiceMock,
  );

  it('Should merge profile and return pair tokens.', async () => {
    await testingRepository.deleteAll();
    await testingRepository.createTestingUser(testUser);
    const result = await mergeProfileCommandHandler.execute({ dto });
    expect(result).toBeDefined();
    expect(result).toEqual({
      user: {
        id: expect.any(String),
        userName: testUser.userName,
        email: testUser.email,
        createdAt: expect.any(String),
      },
      accessToken: 'mockedAccessToken',
      refreshToken: 'mockedRefreshToken',
    });
    expect(result.user.createdAt).not.toBe(testUser.createdAt);

    const user = await testingRepository.getUser(result.user.id);
    expect(user.isConfirmed).toBe(true);
  });
});
