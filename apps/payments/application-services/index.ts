import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { SubscribeCommandHandler } from './commands/subscribe.command-handler';

export * from './payments.facade';

export const PAYMENTS_COMMAND_HANDLER: Type<ICommandHandler>[] = [
  SubscribeCommandHandler,
];

export const PAYMENTS_QUERIES_HANDLER: Type<IQueryHandler>[] = [];
