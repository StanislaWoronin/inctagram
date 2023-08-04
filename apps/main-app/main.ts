import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '../../libs/configs/swagger.config';
import { AuthModule } from './auth/auth.module';
import { createApp } from './create-app';
import { MainAppConfig } from './config/main-app.config';
import { TMainAppConfig } from './config/main-app-config.type';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { Microservices } from '../../libs/shared/enums/microservices-name.enum';

export let mainAppConfig: TMainAppConfig;

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = createApp(rawApp);

  const configService = app.get(ConfigService);
  const customConfig = app.get(MainAppConfig);
  mainAppConfig = customConfig.configInit(configService);

  const port = mainAppConfig.ports.mainAppPort;
  const appUrl = mainAppConfig.appUrl;
  const document = SwaggerModule.createDocument(app, swaggerConfig(), {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    include: [AppModule, AuthModule, SubscriptionsModule],
  });
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port, () => {
    Logger.verbose(
      `${Microservices.MainApp} microservice listen.`,
      'Main-app.Main',
    );
    Logger.verbose(`App link ${appUrl}`, 'Main-app.Main');
    Logger.verbose(
      `Swagger documentation on ${appUrl}/swagger`,
      'Main-app.Main',
    );
  });
}

bootstrap();
