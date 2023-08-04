import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscribeCommand } from './subscribe.command';
import { StripeAdapter } from '../../../../libs/adapters/payments-adapters/stripe.adapter';

@CommandHandler(SubscribeCommand)
export class SubscribeViaStripeCommandHandler
  implements ICommandHandler<SubscribeCommand, boolean>
{
  constructor(private stripeAdapter: StripeAdapter) {}

  async execute({ dto }: SubscribeCommand): Promise<boolean> {
    return true;
  }
}
