import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentManager } from '../../service/payment.manager';

import { UserDataWith } from '../../../main-app/users/dto/id-with.dto';
import { SubscribeDto } from '../../../main-app/subscriptions/dto/subscribe.dto';
import { SubscriptionRepository } from '../../db.providers/subscription,repository';
import { SubscriptionQueryRepository } from '../../db.providers/subscription.query-repository';

export class SubscribeCommand {
  constructor(public readonly dto: UserDataWith<SubscribeDto>) {}
}

@CommandHandler(SubscribeCommand)
export class SubscribeCommandHandler
  implements ICommandHandler<SubscribeCommand, boolean>
{
  constructor(
    private paymentManager: PaymentManager,
    private subscriptionRepository: SubscriptionRepository,
    private subscriptionQueryRepository: SubscriptionQueryRepository,
  ) {}

  async execute({ dto }: SubscribeCommand): Promise<boolean> {
    const customerExists = await this.subscriptionQueryRepository.getCustomer(
      dto.userEmail,
    );
    const paymentResult = await this.paymentManager.createPayment(dto);
    return true;
  }
}
