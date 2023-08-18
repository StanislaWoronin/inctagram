import { StripeAdapter } from '../../../libs/adapters/payments-adapters/stripe.adapter';
import { PayPallAdapter } from '../../../libs/adapters/payments-adapters/pay-pall.adapter';
import { SubscribeDto } from '../../main-app/subscriptions/dto/subscribe.dto';
import { IPayment } from '../../../libs/adapters/payments-adapters/payment.interface';
import { PaymentMethod } from '../../../libs/shared/enums/payment-method.enum';
import { UserDataWith, UserIdWith } from '../../main-app/users/dto/id-with.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentManager {
  adapters: Partial<Record<PaymentMethod, IPayment>> = {
    [PaymentMethod.PayPall]: this.payPallAdapter,
    [PaymentMethod.Stripe]: this.stripeAdapter,
  };
  constructor(
    readonly payPallAdapter: PayPallAdapter,
    readonly stripeAdapter: StripeAdapter,
  ) {
    //this.adapters[PaymentMethod.PayPall] = payPallAdapter;
    this.adapters[PaymentMethod.Stripe] = stripeAdapter;
  }

  async createPayment(dto: UserDataWith<SubscribeDto>, customerId: string) {
    return await this.adapters[dto.paymentMethod].createPayment(
      dto,
      customerId,
    );
  }
}
