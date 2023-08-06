import { SubscribeDto } from '../../../apps/main-app/subscriptions/dto/subscribe.dto';
import {
  UserDataWith,
  UserIdWith,
} from '../../../apps/main-app/users/dto/id-with.dto';
import { IPayment } from './payment.interface';
import { paymentsConfig } from '../../../apps/payments/main';
import { Stripe } from 'stripe';
import { SubscriptionType } from '../../shared/enums/subscription.enum';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StripeAdapter implements IPayment {
  async createPayment(
    dto: UserDataWith<SubscribeDto>,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const stripe = this.stripeInit();

    const prices = await stripe.prices.list();
    console.dir(prices.data, { depth: null });
    const price =
      dto.subscriptionType === SubscriptionType.Personal
        ? paymentsConfig.subscriptionPrice.personalSubscribe
        : paymentsConfig.subscriptionPrice.businessSubscribe;

    const sessionParameters = {
      mode: 'subscription',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      success_url: 'http://localhost:5050/subscribe/success',
      cancel_url: 'http://localhost:5050/subscribe/cansel',
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        {
          price: prices.data[0].id,
          quantity: dto.amount,
        },
      ],
    } as Stripe.Checkout.SessionCreateParams;

    try {
      const a = await stripe.checkout.sessions.create(sessionParameters);
      console.log(a, '<-----');
      return a;
    } catch (e) {
      console.log(e);
      throw new RpcException(new Error());
    }
  }

  private stripeInit() {
    const stripeKey = paymentsConfig.stripeKey;
    const stripe = new Stripe(stripeKey, { apiVersion: '2022-11-15' });

    return stripe;
  }
}
