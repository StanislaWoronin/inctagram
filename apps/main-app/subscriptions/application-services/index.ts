import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { SubscriptionCommandHandler } from './command/subscribe/subscription.command-handler';

export * from './subscriptions.facade';

export const SUBSCRIPTIONS_COMMANDS_HANDLERS: Type<ICommandHandler>[] = [
  SubscriptionCommandHandler,
];

export const SUBSCRIPTIONS_QUERIES_HANDLERS: Type<IQueryHandler>[] = [];
