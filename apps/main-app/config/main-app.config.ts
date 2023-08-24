import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { userEndpoints } from '../../../libs/shared/endpoints/user.endpoints';
import { TMainAppConfig } from './main-app-config.type';
import { EnvironmentName } from '../../../libs/shared/enums/environment-name.enum';
import { Environment } from '../../../libs/shared/enums/environment.enum';

@Injectable()
export class MainAppConfig {
  private readonly logger = new Logger(MainAppConfig.name);

  configInit(configService: ConfigService): TMainAppConfig {
    // Data base
    let environment = configService.get(EnvironmentName.NodeEnv);
    if (!environment) environment = Environment.Production;

    const postgresUri =
      environment === Environment.Production
        ? configService.get(EnvironmentName.ProdDb)
        : configService.get(EnvironmentName.LocalDb);
    if (!postgresUri) this.logger.warn('Date base URL not found!');
    process.env[EnvironmentName.ProdDb] = postgresUri;

    // Ports
    const mainAppPort = configService.get(EnvironmentName.MainAppPort);
    if (!mainAppPort) this.logger.warn('Main-app microservice port not found!');

    const fileStoragePort = configService.get(EnvironmentName.FileStoragePort);
    if (!mainAppPort)
      this.logger.warn('File-storage microservice port not found!');

    const paymentsPort = configService.get(EnvironmentName.PaymentsPort);
    if (!paymentsPort)
      this.logger.warn('Payments microservice port not found!');

    const appUrl =
      environment === Environment.Production
        ? configService.get(EnvironmentName.ServerUrl)
        : `http://localhost:${mainAppPort}`;

    const clientUrl = configService.get(EnvironmentName.ClientUrl);
    if (!clientUrl) this.logger.warn('Client URL not found!');

    // Adapters
    const rmqUrl = configService.get(EnvironmentName.RmqUrl);
    if (!rmqUrl) this.logger.warn('RabbitMQ URL not found!');

    // Mail service
    const mailService = configService.get(EnvironmentName.MailServiceName);
    if (!mailService) this.logger.warn('Mail service name not found!');

    const mailAddress = configService.get(EnvironmentName.EmailAddress);
    if (!mailAddress) this.logger.warn('Mail address not found!');

    const mailPass = configService.get(EnvironmentName.EmailPass);
    if (!mailPass) this.logger.warn('Password for mail service not found!');

    // Jwt
    const secretAT = configService.get(EnvironmentName.ATSecret);
    const secretRT = configService.get(EnvironmentName.RTSecret);

    // Recaptcha
    const recaptchaUrl =
      configService.get(EnvironmentName.RecaptchaUrl) ??
      'https://www.google.com/recaptcha/api/siteverify';
    const recaptchaSecret = configService.get('RECAPTCHA_SECRET');
    if (!recaptchaSecret) this.logger.warn('Recaptcha secret not found!');

    // OAuth
    const redirectUrl =
      configService.get(EnvironmentName.OAuthRedirectUrl) ??
      `${appUrl}/${userEndpoints.default()}/${userEndpoints.getUserProfile()}`;

    // Google
    const googleClientId = configService.get(EnvironmentName.GoogleClientId);
    if (!googleClientId) this.logger.warn('Google client ID not found!');

    const googleClientSecret = configService.get(
      EnvironmentName.GoogleClientSecret,
    );
    if (!googleClientSecret)
      this.logger.warn('Google client secret not found!');

    // GitHub
    const gitHubClientId = configService.get(EnvironmentName.GitHubClientId);
    if (!gitHubClientId) this.logger.warn('GitHub client ID not found!');

    const gitHubClientSecret = configService.get(
      EnvironmentName.GitHubClientSecret,
    );
    if (!gitHubClientSecret)
      this.logger.warn('GitHub client secret not found!');

    return {
      ports: {
        mainAppPort: Number(mainAppPort),
        fileStoragePort: Number(fileStoragePort),
        paymentsPort: Number(paymentsPort),
      },
      adapters: {
        rmqUrl,
        mail: {
          mailService,
          mailAddress,
          mailPass,
        },
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
      clientUrl,
    };
  }
}
