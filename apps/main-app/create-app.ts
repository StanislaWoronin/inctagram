import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../libs/exception-filters/http.exception.filter';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

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

export const createApp = (app: INestApplication): INestApplication => {
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://localhost:63342',
      'https://inctagram-neon.vercel.app',
    ],
    allowedHeaders: 'Content-Type, Access-Control-Allow-Credentials',
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(validationPipeSettings));
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  return app;
};
