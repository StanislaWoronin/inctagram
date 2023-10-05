import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ILoggerParams } from '../midleware/logger.midleware';
import { ClientMeta } from '../../apps/main-app/auth/dto/session-id.dto';

export interface IMetadata {
  clientMeta: ClientMeta;
  logger: ILoggerParams;
  language: Language;
}

export enum Language {
  RU = 'ru',
  EN = 'en',
}

export const Metadata = createParamDecorator(
  (data: string, ctx: ExecutionContext): IMetadata => {
    const request = ctx.switchToHttp().getRequest();

    return {
      clientMeta: {
        ipAddress: request.ip,
        title: request.headers['user-agent'],
      },
      language: request.headers['accept-language'],
      logger: request.loggerParams,
    };
  },
);
