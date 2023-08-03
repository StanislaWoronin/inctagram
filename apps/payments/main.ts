import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getProviderOptions } from '../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../libs/shared/enums/microservices-name.enum';
import { PaymentsModule } from './payments.module';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeConfig } from '../../libs/configs/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentsModule,
    getProviderOptions(Microservices.Payments), // TODO test
  );
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));
}
bootstrap();
