import { NestFactory } from '@nestjs/core';
import { FileStorageModule } from './file-storage.module';
import { MicroserviceOptions, RpcException } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Microservices } from '../../../libs/shared/enums/microservices-name.enum';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';

export const validationPipeSettings = {
  transform: true,
  stopAtFirstError: true,
  exceptionFactory: (errors) => {
    const errorsForResponse = [];
    errors.forEach((e) => {
      const constraintsKeys = Object.keys(e.constraints);
      // constraintsKeys.forEach((key) => {
      //   errorsForResponse.push({
      //     message: e.constraints[key],
      //     field: e.property,
      //   });
      // });
      errorsForResponse.push({
        message: e.constraints[constraintsKeys[0]],
        field: e.property,
      });
    });
    throw new RpcException(errorsForResponse);
  },
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FileStorageModule,
    getProviderOptions(Microservices.FileStorage),
  );
  app.useGlobalPipes(new ValidationPipe(validationPipeSettings));
  useContainer(app.select(FileStorageModule), { fallbackOnErrors: true });
  Logger.verbose('FileStorage Microservice is listening', 'File-storage.Main');
  await app.listen();
}
bootstrap();
