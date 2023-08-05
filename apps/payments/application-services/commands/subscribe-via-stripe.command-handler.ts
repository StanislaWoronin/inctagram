import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SubscribeCommand } from './subscribe.command';
import { PaymentManager } from '../../service/payment.manager';

@CommandHandler(SubscribeCommand)
export class SubscribeViaStripeCommandHandler
  implements ICommandHandler<SubscribeCommand, boolean>
{
  constructor(private paymentManager: PaymentManager) {}

  async execute({ dto }: SubscribeCommand): Promise<boolean> {
    const paymentResult = await this.paymentManager.createPayment(dto);
    return true;
  }
}
