export type TPaymentConfig = {
  stripeKey: string;
  stripeSecret: string;
  subscriptionPrice: SubscriptionPrice;
};

type SubscriptionPrice = {
  personalSubscribe: number;
  businessSubscribe: number;
};
