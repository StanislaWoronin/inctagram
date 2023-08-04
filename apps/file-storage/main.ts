import { NestFactory } from '@nestjs/core';
import { FileStorageModule } from './file-storage.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Microservices } from '../../libs/shared/enums/microservices-name.enum';
import { getProviderOptions } from '../../libs/providers/rabbit-mq/providers.option';
import { validationPipeConfig } from '../../libs/configs/validation-pipe.config';
import { ConfigService } from '@nestjs/config';
import { FileStorageConfig } from './config/file-storage.config';
import { TFileStorageConfig } from './config/file-storage-config.type';

export let fileStorageConfig: TFileStorageConfig;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FileStorageModule,
    getProviderOptions(Microservices.FileStorage),
  );
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  const configService = app.get(ConfigService);
  const customConfig = app.get(FileStorageConfig);
  fileStorageConfig = customConfig.configInit(configService);

  Logger.verbose(
    `${Microservices.FileStorage} microservice listen`,
    'FileStorage.Main',
  );
}
bootstrap();
