import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from './user.facade';

export const userFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new UserFacade(commandBus, queryBus);
