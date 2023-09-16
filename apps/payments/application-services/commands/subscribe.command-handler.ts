import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentManager } from '../../service/payment.manager';

import { UserDataWith } from '../../../main-app/users/dto/id-with.dto';
import { SubscribeDto } from '../../../main-app/subscriptions/dto/subscribe.dto';
import { PaymentsRepository } from '../../db.providers/payments-repository.service';
import { PaymentsQueryRepository } from '../../db.providers/payments-query-repository.service';

export class SubscribeCommand {
  constructor(public readonly dto: UserDataWith<SubscribeDto>) {}
}

@CommandHandler(SubscribeCommand)
export class SubscribeCommandHandler
  implements ICommandHandler<SubscribeCommand, string | boolean>
{
  constructor(
    private paymentManager: PaymentManager,
    private paymentsRepository: PaymentsRepository,
    private paymentsQueryRepository: PaymentsQueryRepository,
  ) {}

  async execute({ dto }: SubscribeCommand): Promise<string | boolean> {
    const customer = await this.paymentsQueryRepository.getCustomer(
      dto.userEmail,
    );

    const paymentResult = await this.paymentManager.createPayment(
      dto,
      customer?.customerId,
    );
    console.log({ paymentResult });
    if (paymentResult) {
      const result = {
        paymentId: paymentResult.id,
        totalPrice: paymentResult.amount_total,
        autoRenewal: paymentResult.automatic_tax.enabled,
        currency: paymentResult.currency,
      };
      // console.log({ result });
      //await this.paymentsRepository.savePaymentResult(result);

      return paymentResult.url;
    }

    return false;
  }
}
