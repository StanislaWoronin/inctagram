import { Subscription } from '../../../../libs/shared/enums/subscription.enum';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../../../../libs/shared/enums/payment-method.enum';

export class UpdateSubscriptionTypeDto {
  @ApiProperty({ enum: Subscription })
  subscriptionType: Subscription;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;
}
