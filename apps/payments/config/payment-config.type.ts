export type TPaymentConfig = {
  // postgresUri: string;
  stripeKey: string;
  stripeSecret: string;
  subscriptionPrice: SubscriptionPrice;
};

type SubscriptionPrice = {
  personalSubscribe: number;
  businessSubscribe: number;
};
