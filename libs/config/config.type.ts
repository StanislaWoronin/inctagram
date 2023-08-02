export type TConfig = {
  adapters: {
    cloud: TCloud;
    mail: {
      mailService: string;
      mailAddress: string;
      mailPass: string;
    };
    rmqUrl: string;
  };
  appUrl: string;
  db: {
    prisma: string;
  };
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
  };
  recaptcha: {
    url: string;
    secret: string;
  };
};

export type TCloud = {
  region: string;
  baseUrl: string;
  bucketName: string;
  accessKey: string;
  secretKey: string;
};
