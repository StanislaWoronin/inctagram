import { Type } from '@nestjs/common';
import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateMainImageCommandHandler } from './commands/update-main-image.command-handler';
import { GetMainImageQuery } from './queries/get-main-image.command-handler';

export * from './file-storage.facade';

export const FILE_STORAGE_COMMANDS_HANDLERS: Type<ICommandHandler>[] = [
  UpdateMainImageCommandHandler,
];

export const FILE_STORAGE_QUERIES_HANDLERS: Type<IQueryHandler>[] = [
  GetMainImageQuery,
];
