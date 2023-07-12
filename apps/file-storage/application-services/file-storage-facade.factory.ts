import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileStorageFacade } from './file-storage.facade';

export const fileStorageFacadeFactory = (
  commandBus: CommandBus,
  queryBus: QueryBus,
) => new FileStorageFacade(commandBus, queryBus);
