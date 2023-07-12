import { ErrorResponse } from '../../libs/shared/errors.response';

export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  body: ErrorResponse;
  status: number;
};
