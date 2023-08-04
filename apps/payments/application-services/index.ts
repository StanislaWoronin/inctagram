import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { SubscribeViaStripeCommandHandler } from './commands/subscribe-via-stripe.command-handler';

export * from './payments.facade';

export const PAYMENTS_COMMAND_HANDLER: Type<ICommandHandler>[] = [
  SubscribeViaStripeCommandHandler,
];

export const PAYMENTS_QUERIES_HANDLER: Type<IQueryHandler>[] = [];
