import { Module, OnModuleInit } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserQueryRepository } from '../users/db.providers/users/user.query-repository';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import {
  SUBSCRIPTIONS_COMMANDS_HANDLERS,
  SUBSCRIPTIONS_QUERIES_HANDLERS,
  SubscriptionsFacade,
} from './application-services';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../../libs/shared/enums/microservices-name.enum';
import { subscriptionsFacadeFactory } from './application-services/subscriptions-facade.factory';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([getProviderOptions(Microservices.Payments)]),
  ],
  controllers: [SubscriptionsController],
  providers: [
    ...SUBSCRIPTIONS_COMMANDS_HANDLERS,
    ...SUBSCRIPTIONS_QUERIES_HANDLERS,
    {
      provide: SubscriptionsFacade,
      inject: [CommandBus, QueryBus],
      useFactory: subscriptionsFacadeFactory,
    },
    ConfigService,
    JwtService,
    PrismaService,
    UserQueryRepository,
  ],
  exports: [],
})
export class SubscriptionsModule implements OnModuleInit {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  onModuleInit(): any {
    this.commandBus.register();
    this.queryBus.register();
  }
}
