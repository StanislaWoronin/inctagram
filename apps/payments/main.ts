import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { getProviderOptions } from '../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../libs/shared/enums/microservices-name.enum';
import { PaymentsModule } from './payments.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { validationPipeConfig } from '../../libs/configs/validation-pipe.config';
import { PaymentsConfig } from './config/payments.config';
import { ConfigService } from '@nestjs/config';
import { TPaymentConfig } from './config/payment-config.type';

export let paymentsConfig: TPaymentConfig;

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentsModule,
    getProviderOptions(Microservices.Payments), // TODO test
  );
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  const configService = app.get(ConfigService);
  const customConfig = app.get(PaymentsConfig);
  paymentsConfig = customConfig.configInit(configService);

  Logger.verbose(
    `${Microservices.Payments} microservice listen.`,
    'Payments.Main',
  );

  app.listen();
}
bootstrap();
