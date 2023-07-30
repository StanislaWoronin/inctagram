declare global {
  declare namespace Express {
    export interface Request {
      loggerParams: any;
    }
  }
}
