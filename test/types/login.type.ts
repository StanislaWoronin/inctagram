import { ErrorResponse } from '../../libs/shared/errors.response';
import { ViewUser } from '../../apps/main-app/users/view-model/user.view-model';

export type TLoginResponse = {
  accessToken: string;
  user: ViewUser;
  refreshToken: string;
  body: ErrorResponse;
  status: number;
};
