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
import { PaymentsQueryRepository } from './db.providers/payments-query-repository.service';
import { PaymentsRepository } from './db.providers/payments-repository.service';
import { PrismaService } from '../../libs/providers/prisma/prisma.service';

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
    PayPallAdapter,
    StripeAdapter,
    ConfigService,
    PaymentsConfig,
    PaymentManager,
    PaymentsRepository,
    PaymentsQueryRepository,
    PrismaService,
  ],
  exports: [],
})
export class PaymentsModule {}
