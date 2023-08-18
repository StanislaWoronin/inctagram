export enum EnvironmentName {
  /** Environment: development/production */
  NodeEnv = 'NODE_ENV',

  // Data base URI
  /** Local data base URI */
  LocalDb = 'LOCAL_DB',
  /** Production data base URI */
  ProdDb = 'PROD_DB',
  /** Local data base URI */
  LocalPaymentsDbUri = 'LOCAL_PAYMENTS_DB',
  /** Production data base URI */
  ProdPaymentsDbUri = 'PAYMENTS_DB',

  // URL of the deployed server
  /** App URL */
  ServerUrl = 'SERVER_URL',

  // Message broker
  /** RabbitMq URI */
  RmqUrl = 'RMQ_URL',

  // Port
  /** Main app port listen */
  MainAppPort = 'MAIN_APP',
  /** Main app port listen */
  FileStoragePort = 'FILE_STORAGE',
  /** Main app port listen */
  PaymentsPort = 'PAYMENTS',

  // Mail service
  /** The name of the server for sending mail */
  MailServiceName = 'SERVICE_NAME',
  /** The email from which the emails are sent */
  EmailAddress = 'EMAIL_ADDRESS',
  /** Password mail service */
  EmailPass = 'EMAIL_PASS',

  // JWT settings
  /** Access token secret */
  ATSecret = 'JWT_ACCESS_TOKEN_SECRET',
  /** Refresh token secret */
  RTSecret = 'JWT_REFRESH_TOKEN_SECRET',

  // Recaptcha
  /** The URL to which is redirected to confirm the recaptcha */
  RecaptchaUrl = 'RECAPTCHA_URL',
  /** Recaptcha secret key */
  RecaptchaSecret = 'RECAPTCHA_SECRET',

  // OAuth 2.0
  /** The URL to which is redirected to confirm the registration via OAuth */
  OAuthRedirectUrl = 'REDIRECT_URL',

  // Google OAuth
  /** Client ID for registration via Google */
  GoogleClientId = 'GOOGLE_CLIENT_ID',
  /** Client secret key for registration via Google */
  GoogleClientSecret = 'GOOGLE_CLIENT_SECRET',

  // GitHub OAuth
  /** Client ID for registration via GitHub */
  GitHubClientId = 'GITHUB_CLIENT_ID',
  /** Client secret key for registration via GitHub */
  GitHubClientSecret = 'GITHUB_CLIENT_SECRET',

  // Clouds
  /** Current cloud service name */
  CloudName = 'CLOUD_NAME',

  // AWS
  /** AWS cloud region */
  AwsRegion = 'AWS_REGION',
  /** AWS cloud URL */
  AwsBaseUrl = 'AWS_BASE_URL',
  /** AWS cloud bucket name */
  AwsBucketName = 'AWS_BUCKET_NAME',
  /** Access key for authorisation un AWS */
  AwsAccessKeyId = 'AWS_ACCESS_KEY_ID',
  /** Secret key for authorisation un AWS */
  AwsAccessSecretKey = 'AWS_SECRET_ACCESS_KEY',

  // Yandex cloud
  /** Yandex cloud region */
  YCRegion = 'YC_REGION',
  /** AWS cloud URL */
  YCBaseUrl = 'YC_BASE_URL',
  /** AWS cloud bucket name */
  YCBucketName = 'YC_BUCKET_NAME',
  /** Access key for authorisation in AWS */
  YCAccessKeyId = 'YC_ACCESS_KEY_ID',
  /** Secret key for authorisation in AWS */
  YCAccessSecretKey = 'YC_SECRET_ACCESS_KEY',

  // Payment
  // Stripe
  /** Key for authorisation in Stripe */
  StripeKey = 'STRIPE_KEY',
  /** Secret for authorisation in Stripe */
  StripeSecret = 'STRIPE_SECRET',
}
