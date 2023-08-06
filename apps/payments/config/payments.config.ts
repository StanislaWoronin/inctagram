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
    console.log(environment);
    const postgresUri =
      environment === Environment.Production
        ? configService.get(EnvironmentName.ProdPaymentsDbUri)
        : configService.get(EnvironmentName.LocalPaymentsDbUri);
    if (!postgresUri) this.logger.warn('Date base URL not found!');
    process.env[EnvironmentName.ProdPaymentsDbUri] = postgresUri;

    const stripeKey = configService.get(EnvironmentName.StripeKey);
    if (!stripeKey) this.logger.warn('Stripe key not found!');

    const stripeSecret = configService.get(EnvironmentName.StripeSecret);
    if (!stripeSecret) this.logger.warn('Stripe secret not found!');

    /** Subscription price is for one day */
    const subscriptionPrice = {
      /** 20c */
      personalSubscribe: 0 * 20,
      /** 1$ 50c */
      businessSubscribe: 1 * 50,
    };

    return {
      stripeKey,
      stripeSecret,
      subscriptionPrice,
    };
  }
}
