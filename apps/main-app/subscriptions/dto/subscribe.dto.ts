import { SubscriptionType } from '../../../../libs/shared/enums/subscription.enum';
import { PaymentMethod } from '../../../../libs/shared/enums/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsPositive } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ enum: SubscriptionType })
  @IsEnum(SubscriptionType)
  subscriptionType: SubscriptionType;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Automatic subscription renewal.',
  })
  @IsBoolean()
  autoRenewal: boolean;

  @ApiProperty({
    description: 'Number of days purchased for subscription',
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
