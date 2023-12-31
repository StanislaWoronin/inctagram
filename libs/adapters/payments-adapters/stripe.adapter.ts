import { SubscribeDto } from '../../../apps/main-app/subscriptions/dto/subscribe.dto';
import { UserDataWith } from '../../../apps/main-app/users/dto/id-with.dto';
import { IPayment } from './payment.interface';
import { paymentsConfig } from '../../../apps/payments/main';
import { Stripe } from 'stripe';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { SubscriptionType } from '../../shared/enums/subscription.enum';

@Injectable()
export class StripeAdapter implements IPayment {
  async createPayment(
    dto: UserDataWith<SubscribeDto>,
    customerId: string | null,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const stripe = this.stripeInit();

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: dto.userName,
        email: dto.userEmail,
      });
      dto['customer'] = customer.id;
    }

    const priceId = this.getPriceId(dto.subscriptionType);

    const sessionParameters = {
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      success_url: 'http://localhost:5050/subscribe/success',
      cancel_url: 'http://localhost:5050/subscribe/cansel',
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          price: priceId,
          quantity: dto.amount,
        },
      ],
    } as Stripe.Checkout.SessionCreateParams;

    try {
      const session = await stripe.checkout.sessions.create(sessionParameters);
      return session;
    } catch (e) {
      console.log(e);
      throw new RpcException(new Error('Payment failed!'));
    }
  }

  private stripeInit() {
    const stripeKey = paymentsConfig.stripeKey;
    const stripe = new Stripe(stripeKey, { apiVersion: '2022-11-15' });

    return stripe;
  }

  private getPriceId(subscriptionType: string): string {
    return subscriptionType === SubscriptionType.Business
      ? paymentsConfig.businessSubscriptionId
      : paymentsConfig.personalSubscriptionId;
  }
}
