import { SqlEmailConfirmation } from './modules/public/auth/infrastructure/sql/entity/email-confirmation.entity';

declare global {
  declare namespace Express {
    export interface Request {
      loggerParams: any;
    }
  }
} // расширение типов
