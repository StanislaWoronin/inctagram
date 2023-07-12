import { ViewUser } from '../../apps/main-app/users/view-model/user.view-model';

export type UserWithTokensType = {
  user: ViewUser;
  accessToken: string;
  refreshToken: string;
};
