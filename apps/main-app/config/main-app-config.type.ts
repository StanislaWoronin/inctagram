export type TMainAppConfig = {
  adapters: {
    mail: {
      mailService: string;
      mailAddress: string;
      mailPass: string;
    };
    rmqUrl: string;
  };
  appUrl: string;
  clientUrl: string;
  jwtTokens: {
    secretAT: string;
    secretRT: string;
  };
  oAuth: {
    redirectUrl: string;
    google: {
      googleClientId: string;
      googleClientSecret: string;
    };
    gitHub: {
      gitHubClientId: string;
      gitHubClientSecret: string;
    };
  };
  ports: {
    mainAppPort: number;
    fileStoragePort: number;
    paymentsPort: number;
  };
  recaptcha: {
    url: string;
    secret: string;
  };
};
