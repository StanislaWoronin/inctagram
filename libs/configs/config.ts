import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client/extension';
import { userEndpoints } from '../shared/endpoints/user.endpoints';
import { TCloud, TConfig } from './config.type';
import { Environment } from './environment.enum';

Injectable();
export class Config {
  private readonly logger = new Logger(Config.name);
  private readonly configService = new ConfigService();

  configInit(): TConfig {
    // Data base
    let environment = this.configService.get('NODE_ENV');
    if (!environment) environment = 'production';

    const postgresUri =
      environment === Environment.Prod
        ? this.configService.get('POSTGRES_URI')
        : this.configService.get('DATABASE_URL');
    if (!postgresUri) this.logger.warn('Date base URL not found!');

    // const prisma = new PrismaClient({
    //   datasources: {
    //     db: {
    //       url: postgresUri,
    //     },
    //   },
    // });

    // Ports
    const mainAppPort = this.configService.get('MAIN_APP');
    if (!mainAppPort) this.logger.warn('Main-app port not found!');

    const fileStoragePort = this.configService.get('FILE_SORAGE');
    if (!mainAppPort) this.logger.warn('File-storage port not found!');

    const appUrl =
      environment === Environment.Prod
        ? this.configService.get('SERVER_URL')
        : `lockalhost:${mainAppPort}`;

    // Adapters
    const rmqUrl = this.configService.get('RMQ_URL');
    if (!rmqUrl) this.logger.warn('RabbitMQ URL not found!');

    // Mail service
    const mailService = this.configService.get('SERVICE_NAME');
    if (!mailService) this.logger.warn('Mail service name not found!');

    const mailAddress = this.configService.get('EMAIL_ADDRESS');
    if (!mailAddress) this.logger.warn('Mail address not found!');

    const mailPass = this.configService.get('EMAIL_PASS');
    if (!mailPass) this.logger.warn('Password for mail service not found!');

    // Jwt
    const secretAT = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
    const secretRT = this.configService.get('JWT_REFRESH_TOKEN_SECRET');

    // Cloud
    const cloudName = this.configService.get('CLOUD_NAME') ?? 'YC';
    const cloud: any = {};
    if (cloudName === 'AWS') {
      cloud.region = this.configService.get('AWS_BASE_URL') ?? 'eu-central-1';
      cloud.baseUrl =
        this.configService.get('AWS_BASE_URL') ??
        'https://s3.eu-central-1.amazonaws.com';
      cloud.bucketName = this.configService.get('AWS_BUCKET_NAME');
      if (!cloud.bucketName)
        this.logger.warn('Aws cloud bucket name not found!');
      cloud.accessKey = this.configService.get('AWS_ACCESS_KEY_ID');
      if (!cloud.accessKey) this.logger.warn('Aws access key not found!');
      cloud.secretKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
      if (!cloud.secretKey) this.logger.warn('Aws secret key not found!');
    } else {
      cloud.region = this.configService.get('YC_REGION') ?? 'us-east-1';
      cloud.baseUrl =
        this.configService.get('YC_BASE_URL') ??
        'https://storage.yandexcloud.net';
      cloud.bucketName = this.configService.get('YC_BUCKET_NAME');
      if (!cloud.bucketName)
        this.logger.warn('Yandex cloud bucket name not found!');
      cloud.accessKey = this.configService.get('YC_ACCESS_KEY_ID');
      if (!cloud.accessKey)
        this.logger.warn('Yandex cloud access key not found!');
      cloud.secretKey = this.configService.get('YC_SECRET_ACCESS_KEY');
      if (!cloud.secretKey)
        this.logger.warn('Yandex cloud secret key not found!');
    }

    // Recaptcha
    const recaptchaUrl =
      this.configService.get('RECAPTCHA_URL') ??
      'https://www.google.com/recaptcha/api/siteverify';
    const recaptchaSecret = this.configService.get('RECAPTCHA_SECRET');
    if (!recaptchaSecret) this.logger.warn('Recaptcha secret not found!');

    // OAuth
    const redirectUrl =
      this.configService.get('REDIRECT_URL') ??
      `${appUrl}/${userEndpoints.default()}/${userEndpoints.getUserProfile()}`;

    // Google
    const googleClientId = this.configService.get('GOOGLE_CLIENT_ID');
    if (!googleClientId) this.logger.warn('Google client ID not found!');

    const googleClientSecret = this.configService.get('GOOGLE_CLIENT_SECRET');
    if (!googleClientSecret)
      this.logger.warn('Google client secret not found!');

    // GitHub
    const gitHubClientId = this.configService.get('GITHUB_CLIENT_ID');
    if (!gitHubClientId) this.logger.warn('GitHub client ID not found!');

    const gitHubClientSecret = this.configService.get('GITHUB_CLIENT_SECRET');
    if (!gitHubClientSecret)
      this.logger.warn('GitHub client secret not found!');

    return {
      // db: {
      //   prisma,
      // },
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
