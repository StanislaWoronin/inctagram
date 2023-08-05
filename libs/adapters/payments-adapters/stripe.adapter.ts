import { SubscribeDto } from '../../../apps/main-app/subscriptions/dto/subscribe.dto';
import { UserIdWith } from '../../../apps/main-app/users/dto/id-with.dto';
import { IPayment } from './payment.interface';
import { paymentsConfig } from '../../../apps/payments/main';
import { Stripe } from 'stripe';
import { SubscriptionType } from '../../shared/enums/subscription.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeAdapter implements IPayment {
  async createPayment(
    dto: UserIdWith<SubscribeDto>,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const stripe = this.stripeInit();

    const price =
      dto.subscriptionType === SubscriptionType.Personal
        ? paymentsConfig.subscriptionPrice.personalSubscribe
        : paymentsConfig.subscriptionPrice.businessSubscribe;

    const sessionParameters = {
      client_reference_id: dto.userId,
      mode: 'subscription',
      success_url: 'http://localhost:5050/subscribe/success',
      cancel_url: 'http://localhost:5050/subscribe/cansel',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            product_data: {
              name: `You purchase a ${dto.subscriptionType.toLowerCase()} subscription to inctagram!`,
            },
            unit_amount: 1, // 100$ * 100c
            currency: 'USD',
          },
          quantity: dto.amount,
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Configured to expire after 30 minutes.
    } as Stripe.Checkout.SessionCreateParams;

    try {
      const a = await stripe.checkout.sessions.create(sessionParameters);
      console.log(a, '<-----');
      return a;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  private stripeInit() {
    const stripeKey = paymentsConfig.stripeKey;
    const stripe = new Stripe(stripeKey, { apiVersion: '2022-11-15' });

    return stripe;
  }
}
