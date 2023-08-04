import { PaymentMethod } from '../../../../libs/shared/enums/payment-method.enum';
import { Commands } from '../../../../libs/shared/enums/pattern-commands-name.enum';
import { ImATeapotException } from '@nestjs/common';

export const getPatternViaPaymentMethod = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
    case PaymentMethod.Stripe:
      return { cmd: Commands.SubscribeStripe };
    case PaymentMethod.PayPall:
      return { cmd: Commands.SubscribeStripe };
    case PaymentMethod.Sbp:
      return { cmd: Commands.SubscribeSBP };
    default:
      throw new ImATeapotException();
  }
};
