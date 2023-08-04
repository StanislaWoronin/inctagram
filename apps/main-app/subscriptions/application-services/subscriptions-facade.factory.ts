import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from '../../users/application-services';
import { SubscriptionsFacade } from './subscriptions.facade';

export const subscriptionsFacadeFactory = (
  commandBus: CommandBus,
  queryBus: QueryBus,
) => new SubscriptionsFacade(commandBus, queryBus);
