import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../libs/exception-filters/http.exception.filter';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { validationPipeSettings } from './main';
import cookieParser from 'cookie-parser';

export const createApp = (app: INestApplication): INestApplication => {
  app.enableCors({
    origin: 'http://localhost:3000',
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(validationPipeSettings));
  app.useGlobalFilters(new HttpExceptionFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  return app;
};
