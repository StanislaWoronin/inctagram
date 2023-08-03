import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '../../libs/configs/swagger.config';
import { AuthModule } from './auth/auth.module';
import { createApp } from './create-app';
import { Config } from '../../libs/configs/config';
import { TConfig } from '../../libs/configs/config.type';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

export let config: TConfig;

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = createApp(rawApp);

  const configService = app.get(ConfigService);
  const customConfig = app.get(Config);
  config = customConfig.configInit(configService);

  // const port = configService.get<number>('MAIN_APP');
  // const serverUrl = configService.get<string>('SERVER_URL');
  const port = config.ports.mainAppPort;
  const appUrl = config.appUrl;
  const document = SwaggerModule.createDocument(app, swaggerConfig(), {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    include: [AppModule, AuthModule, SubscriptionsModule],
  });
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port, () => {
    Logger.verbose(`App link ${appUrl}`, 'Main-app.Main');
    Logger.verbose(
      `Swagger documentation on ${appUrl}/swagger`,
      'Main-app.Main',
    );
  });
}

bootstrap();
