import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import {
  PaymentsFacade,
  PAYMENTS_COMMAND_HANDLER,
  PAYMENTS_QUERIES_HANDLER,
} from './application-services';
import { paymentsFacadeFactory } from './application-services/payments-facade.factory';
import { StripeAdapter } from '../../libs/adapters/payments-adapters/stripe.adapter';
import { ConfigService } from '@nestjs/config';
import { PaymentsConfig } from './config/payments.config';
import { PaymentManager } from './service/payment.manager';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../libs/shared/enums/microservices-name.enum';
import { PayPallAdapter } from '../../libs/adapters/payments-adapters/pay-pall.adapter';

@Module({
  imports: [
    CqrsModule,
    //ClientsModule.register([getProviderOptions(Microservices.Payments)]), // TODO test
  ],
  controllers: [PaymentsController],
  providers: [
    ...PAYMENTS_COMMAND_HANDLER,
    ...PAYMENTS_QUERIES_HANDLER,
    {
      provide: PaymentsFacade,
      inject: [CommandBus, QueryBus],
      useFactory: paymentsFacadeFactory,
    },
    PayPallAdapter,
    StripeAdapter,
    ConfigService,
    PaymentsConfig,
    PaymentManager,
  ],
  exports: [],
})
export class PaymentsModule {}
