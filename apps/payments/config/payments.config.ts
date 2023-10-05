import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentName } from '../../../libs/shared/enums/environment-name.enum';
import { TPaymentConfig } from './payment-config.type';
import { Environment } from '../../../libs/shared/enums/environment.enum';

@Injectable()
export class PaymentsConfig {
  private readonly logger = new Logger(PaymentsConfig.name);

  configInit(configService: ConfigService): TPaymentConfig {
    let environment = configService.get(EnvironmentName.NodeEnv);
    if (!environment) environment = Environment.Production;

    const stripeKey = configService.get(EnvironmentName.StripeKey);
    if (!stripeKey) this.logger.warn('Stripe key not found!');

    const stripeSecret = configService.get(EnvironmentName.StripeSecret);
    if (!stripeSecret) this.logger.warn('Stripe secret not found!');

    const personalSubscriptionId = configService.get(
      EnvironmentName.PersonalSubscriptionId,
    );
    if (!personalSubscriptionId)
      this.logger.warn('Personal subscription ID secret not found!');

    const businessSubscriptionId = configService.get(
      EnvironmentName.BusinessSubscriptionId,
    );
    if (!businessSubscriptionId)
      this.logger.warn('Business subscription ID secret not found!');

    return {
      stripeKey,
      stripeSecret,
      personalSubscriptionId,
      businessSubscriptionId,
    };
  }
}
