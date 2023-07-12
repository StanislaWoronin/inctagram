import { ViewUser } from '../../../apps/main-app/users/view-model/user.view-model';

export const createUserResponse = (
  userName: string,
  email: string,
): ViewUser => {
  return {
    id: expect.any(String),
    userName,
    email,
    createdAt: expect.any(String),
  };
};
