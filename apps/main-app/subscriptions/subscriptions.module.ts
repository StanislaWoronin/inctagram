import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';

@Module({
  imports: [],
  controllers: [SubscriptionsController],
  providers: [],
  exports: [],
})
export class SubscriptionsModule {}
