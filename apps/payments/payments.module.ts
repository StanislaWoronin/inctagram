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

@Module({
  imports: [CqrsModule],
  controllers: [PaymentsController],
  providers: [
    ...PAYMENTS_COMMAND_HANDLER,
    ...PAYMENTS_QUERIES_HANDLER,
    {
      provide: PaymentsFacade,
      inject: [CommandBus, QueryBus],
      useFactory: paymentsFacadeFactory,
    },
    StripeAdapter,
    ConfigService,
    PaymentsConfig,
  ],
  exports: [],
})
export class PaymentsModule {}
