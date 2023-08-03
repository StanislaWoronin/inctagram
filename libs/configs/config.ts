import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client/extension';
import { userEndpoints } from '../shared/endpoints/user.endpoints';
import { TCloud, TConfig } from './config.type';
import { Environment } from './environment.enum';

Injectable();
export class Config {
  private readonly logger = new Logger(Config.name);

  configInit(configService: ConfigService) {
    // Data base
    let environment = configService.get('NODE_ENV');
    if (!environment) environment = 'production';

    const postgresUri =
      environment === Environment.Prod
        ? configService.get('POSTGRES_URI')
        : configService.get('DATABASE_URL');
    if (!postgresUri) this.logger.warn('Date base URL not found!');

    // Ports
    const mainAppPort = configService.get('MAIN_APP');
    if (!mainAppPort) this.logger.warn('Main-app port not found!');

    const fileStoragePort = configService.get('FILE_SORAGE');
    if (!mainAppPort) this.logger.warn('File-storage port not found!');

    const appUrl =
      environment === Environment.Prod
        ? configService.get('SERVER_URL')
        : `http://localhost:${mainAppPort}`;

    // Adapters
    const rmqUrl = configService.get('RMQ_URL');
    if (!rmqUrl) this.logger.warn('RabbitMQ URL not found!');

    // Mail service
    const mailService = configService.get('SERVICE_NAME');
    if (!mailService) this.logger.warn('Mail service name not found!');

    const mailAddress = configService.get('EMAIL_ADDRESS');
    if (!mailAddress) this.logger.warn('Mail address not found!');

    const mailPass = configService.get('EMAIL_PASS');
    if (!mailPass) this.logger.warn('Password for mail service not found!');

    // Jwt
    const secretAT = configService.get('JWT_ACCESS_TOKEN_SECRET');
    const secretRT = configService.get('JWT_REFRESH_TOKEN_SECRET');

    // Cloud
    const cloudName = configService.get('CLOUD_NAME') ?? 'YC';
    const cloud: any = {};
    if (cloudName === 'AWS') {
      cloud.region = configService.get('AWS_BASE_URL') ?? 'eu-central-1';
      cloud.baseUrl =
        configService.get('AWS_BASE_URL') ??
        'https://s3.eu-central-1.amazonaws.com';
      cloud.bucketName = configService.get('AWS_BUCKET_NAME');
      if (!cloud.bucketName)
        this.logger.warn('Aws cloud bucket name not found!');
      cloud.accessKey = configService.get('AWS_ACCESS_KEY_ID');
      if (!cloud.accessKey) this.logger.warn('Aws access key not found!');
      cloud.secretKey = configService.get('AWS_SECRET_ACCESS_KEY');
      if (!cloud.secretKey) this.logger.warn('Aws secret key not found!');
    } else {
      cloud.region = configService.get('YC_REGION') ?? 'us-east-1';
      cloud.baseUrl =
        configService.get('YC_BASE_URL') ?? 'https://storage.yandexcloud.net';
      cloud.bucketName = configService.get('YC_BUCKET_NAME');
      if (!cloud.bucketName)
        this.logger.warn('Yandex cloud bucket name not found!');
      cloud.accessKey = configService.get('YC_ACCESS_KEY_ID');
      if (!cloud.accessKey)
        this.logger.warn('Yandex cloud access key not found!');
      cloud.secretKey = configService.get('YC_SECRET_ACCESS_KEY');
      if (!cloud.secretKey)
        this.logger.warn('Yandex cloud secret key not found!');
    }

    // Recaptcha
    const recaptchaUrl =
      configService.get('RECAPTCHA_URL') ??
      'https://www.google.com/recaptcha/api/siteverify';
    const recaptchaSecret = configService.get('RECAPTCHA_SECRET');
    if (!recaptchaSecret) this.logger.warn('Recaptcha secret not found!');

    // OAuth
    const redirectUrl =
      configService.get('REDIRECT_URL') ??
      `${appUrl}/${userEndpoints.default()}/${userEndpoints.getUserProfile()}`;

    // Google
    const googleClientId = configService.get('GOOGLE_CLIENT_ID');
    if (!googleClientId) this.logger.warn('Google client ID not found!');

    const googleClientSecret = configService.get('GOOGLE_CLIENT_SECRET');
    if (!googleClientSecret)
      this.logger.warn('Google client secret not found!');

    // GitHub
    const gitHubClientId = configService.get('GITHUB_CLIENT_ID');
    if (!gitHubClientId) this.logger.warn('GitHub client ID not found!');

    const gitHubClientSecret = configService.get('GITHUB_CLIENT_SECRET');
    if (!gitHubClientSecret)
      this.logger.warn('GitHub client secret not found!');

    return {
      ports: {
        mainAppPort: Number(mainAppPort),
        fileStoragePort: Number(fileStoragePort),
      },
      adapters: {
        rmqUrl,
        mail: {
          mailService,
          mailAddress,
          mailPass,
        },
        cloud: cloud,
      },
      jwtTokens: {
        secretAT,
        secretRT,
      },
      recaptcha: {
        url: recaptchaUrl,
        secret: recaptchaSecret,
      },
      oAuth: {
        redirectUrl,
        google: {
          googleClientId,
          googleClientSecret,
        },
        gitHub: {
          gitHubClientId,
          gitHubClientSecret,
        },
      },
      appUrl,
    };
  }
}
