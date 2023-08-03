import { Subscription } from '../../../../libs/shared/enums/subscription.enum';
import { PaymentMethod } from '../../../../libs/shared/enums/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeDto {
  @ApiProperty({ enum: Subscription })
  subscriptionType: Subscription;

  @ApiProperty({ enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Automatic subscription renewal.',
  })
  autoRenewal: boolean;

  @ApiProperty({
    description: 'Number of days purchased for subscription',
  })
  subscriptionCount: number;
}
