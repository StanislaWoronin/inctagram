import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PaymentsFacade } from './payments.facade';

export const paymentsFacadeFactory = (
  commandBus: CommandBus,
  queryBus: QueryBus,
) => new PaymentsFacade(commandBus, queryBus);
