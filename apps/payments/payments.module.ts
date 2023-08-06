import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import {
  PAYMENTS_COMMAND_HANDLER,
  PAYMENTS_QUERIES_HANDLER,
  PaymentsFacade,
} from './application-services';
import { paymentsFacadeFactory } from './application-services/payments-facade.factory';
import { StripeAdapter } from '../../libs/adapters/payments-adapters/stripe.adapter';
import { ConfigService } from '@nestjs/config';
import { PaymentsConfig } from './config/payments.config';
import { PaymentManager } from './service/payment.manager';
import { PayPallAdapter } from '../../libs/adapters/payments-adapters/pay-pall.adapter';
import { SubscriptionQueryRepository } from './db.providers/subscription.query-repository';
import { SubscriptionRepository } from './db.providers/subscription,repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { getOptions } from "sequelize-typescript";
import { paymentsConfig } from "./main";

@Module({
  imports: [CqrsModule, SequelizeModule.forRoot({uri: paymentsConfig.})],
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
    SubscriptionRepository,
    SubscriptionQueryRepository,
  ],
  exports: [],
})
export class PaymentsModule {}
