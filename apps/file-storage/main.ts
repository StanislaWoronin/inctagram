import { NestFactory } from '@nestjs/core';
import { FileStorageModule } from './file-storage.module';
import { MicroserviceOptions, RpcException } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Microservices } from '../../libs/shared/enums/microservices-name.enum';
import { getProviderOptions } from '../../libs/providers/rabbit-mq/providers.option';
import { validationPipeConfig } from '../../libs/configs/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FileStorageModule,
    getProviderOptions(Microservices.FileStorage),
  );
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
}
bootstrap();
