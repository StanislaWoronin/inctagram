import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from '../../libs/documentation/swagger/swagger.config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { createApp } from './create-app';

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = createApp(rawApp);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('MAIN_APP');
  console.log('main - main', port);
  const serverUrl = configService.get<string>('SERVER_URL');

  const usersDocument = SwaggerModule.createDocument(app, swaggerConfig(), {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    include: [AppModule, AuthModule, UserModule],
  });
  //SwaggerModule.setup('swagger', app, usersDocument, swaggerOptions(serverUrl));
  SwaggerModule.setup('swagger', app, usersDocument);

  await app.listen(port, () => {
    Logger.verbose(`Application listen on port: ${port}`, 'Main-app.Main');
    Logger.verbose(`App dev link http://localhost:${port}`, 'Main-app.Main');
    Logger.verbose(`App link ${serverUrl}`, 'Main-app.Main');
    Logger.verbose(
      `Swagger documentation on ${serverUrl}/swagger`,
      'Main-app.Main',
    );
  });
}

bootstrap();
