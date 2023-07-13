import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

export const settings = {
  environment: process.env.NODE_ENV,
  transportName: Transport.RMQ,
  rmqUrl: process.env.RMQ_URL,
  host: {
    localHost: '0.0.0.0',
  },
  port: {
    API_GATEWAY: Number(process.env.API_GATEWAY),
    FIle_STORAGE_MS: Number(process.env.FILE_STORAGE_MS),
  },
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
  },
};
