import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { CloudName } from './enums/cloud-name.enum';
dotenv.config();

export const settings = {
  environment: process.env.NODE_ENV,
  clientName: 'Client',
  port: {
    MAIN_APP: Number(process.env.MAIN_APP),
    FILE_STORAGE: Number(process.env.FILE_STORAGE),
  },
  // OAuth settings
  oauth: {
    LOCAL_REDIRECT_URL: process.env.LOCAL_REDIRECT_URL,
    REDIRECT_URL: process.env.REDIRECT_URL,
  },
  // cloud settings
  cloud: {
    cloudName: CloudName.YandexCloud,
    AWS: {
      REGION: process.env.AWS_REGION,
      BASE_URL: process.env.AWS_BASE_URL,
      BUCKET_NAME: process.env.AWS_BUCKET_NAME,
      ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    },
    YandexCloud: {
      REGION: process.env.YC_REGION,
      BASE_URL: process.env.YC_BASE_URL,
      BUCKET_NAME: process.env.YC_BUCKET_NAME,
      ACCESS_KEY_ID: process.env.YC_ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: process.env.YC_SECRET_ACCESS_KEY,
    },
  },
  // transport settings
  transportName: Transport.TCP,
  rmqUrl: process.env.RMQ_URL,
  host: {
    localHost: '0.0.0.0',
  },
  // tokens settings
  secret: {
    ACCESS_TOKEN: process.env.JWT_ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN_SECRET,
  },
  timeLife: {
    CONFIRMATION_CODE: 24 * 60 * 60 * 1000, // milliseconds
    PASSWORD_RECOVERY_CODE: 24 * 60 * 60 * 1000, // milliseconds
    TOKEN_TIME: 15 * 21 * 60 * 60 * 1000, // milliseconds
    ACCESS_TOKEN: '15 minutes',
    REFRESH_TOKEN: '15 day',
    deletedPost: 24 * 60 * 60 * 1000, // milliseconds
  },
  pagination: {
    pageSize: 9,
  },
  uploadFile: {
    maxPostCount: 10,
  },
};
