import { TokensFactory } from './tokens.factory';

const jwtServiceMock: any = {
  signAsync: jest
    .fn()
    .mockImplementationOnce(() => 'mockedAccessToken')
    .mockImplementationOnce(() => 'mockedRefreshToken'),
};

describe('TokensFactory', () => {
  const tokensFactory = new TokensFactory(jwtServiceMock);

  it('should generate pair of tokens', async () => {
    const userId = 'mockUserId';
    const deviceId = 'mockDeviceId';

    const result = await tokensFactory.getPairTokens(userId, deviceId);

    expect(jwtServiceMock.signAsync).toHaveBeenCalledTimes(2);

    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
      { id: userId, deviceId: deviceId },
      { secret: expect.any(String), expiresIn: expect.any(String) },
    );

    expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
      { id: userId, deviceId: deviceId },
      { secret: expect.any(String), expiresIn: expect.any(String) },
    );

    expect(result).toEqual({
      accessToken: 'mockedAccessToken',
      refreshToken: 'mockedRefreshToken',
    });
  });
});
