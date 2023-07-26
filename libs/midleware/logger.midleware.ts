import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { Request } from 'express';

export interface ILoggerParams {
  id: string;
  method: string;
  path: string;
  user: {
    userAgent: string | null;
    ipAddress: string;
  };
  tokens: {
    accessToken: boolean;
    refreshToken: boolean;
  };
  data: {
    params: string;
    body: any;
    query: string;
  };
  logging: any;
  errors: any;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const loggerParams = {
      id: randomUUID(),
      method: req.method,
      path: req.url,
      user: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
      },
      tokens: {
        accessToken: !!req.headers['authorization']?.split(' ')[1],
        refreshToken: !!req.headers['cookie']?.split('=')[1],
      },
      data: {
        params: req.params,
        body: req.body,
        query: req.query,
      },
      logging: {},
      errors: {},
    };
    req.loggerParams = loggerParams;
    next();
  }
}
