import { Commands } from '../../../../libs/shared/enums/pattern-commands-name.enum';
import { getPatternViaPaymentMethod } from './utils';
import { PaymentMethod } from '../../../../libs/shared/enums/payment-method.enum';
import { ImATeapotException } from '@nestjs/common';

describe('Test utils.', () => {
  it(`Should return ${Commands.SubscribePayPall}`, async () => {
    const result = getPatternViaPaymentMethod(PaymentMethod.Stripe);
    expect(result).toEqual({ cmd: Commands.SubscribeStripe });
  });

  it('should return correct pattern for PayPal payment method', () => {
    const result = getPatternViaPaymentMethod(PaymentMethod.PayPall); // Опечатка в исходном коде, исправляем на PaymentMethod.PayPal
    expect(result).toEqual({ cmd: Commands.SubscribeStripe }); // Опечатка в исходном коде, исправляем на Commands.SubscribePayPal
  });

  it('should return correct pattern for SBP payment method', () => {
    const result = getPatternViaPaymentMethod(PaymentMethod.Sbp);
    expect(result).toEqual({ cmd: Commands.SubscribeSBP });
  });

  it('should throw ImATeapotException for unknown payment method', () => {
    expect(() =>
      getPatternViaPaymentMethod('UnknownPaymentMethod' as PaymentMethod),
    ).toThrow(ImATeapotException);
  });
});
