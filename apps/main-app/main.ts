import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import {
  swaggerConfig,
  swaggerOptions,
} from '../../libs/documentation/swagger/swagger.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { createApp } from './create-app';

export const validationPipeSettings = {
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    const errorsForResponse = [];
    errors.forEach((e) => {
      const constraintsKeys = Object.keys(e.constraints);
      constraintsKeys.forEach((key) => {
        errorsForResponse.push({
          message: e.constraints[key],
          field: e.property,
        });
      });
    });
    throw new BadRequestException(errorsForResponse);
  },
};

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = createApp(rawApp);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('MAIN_APP');
  const serverUrl = `https://inctagram-api.fly.dev`;

  const usersDocument = SwaggerModule.createDocument(app, swaggerConfig(), {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    include: [AppModule, AuthModule, UserModule],
  });
  SwaggerModule.setup('swagger', app, usersDocument, swaggerOptions(serverUrl));

  await app.listen(port, () => {
    Logger.verbose(`Application listen on ${serverUrl}`, 'Main-app.Main');
    Logger.verbose(
      `Swagger documentation on ${serverUrl}/swagger`,
      'Main-app.Main',
    );
  });
}

bootstrap();
