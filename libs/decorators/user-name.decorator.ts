import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserData = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    if (request.userName) {
      request.userData.userName = request.userName;
    }
    if (request.email) {
      request.userData.userName = request.userName;
    }

    return request.userData;
  },
);

export type TUserData = {
  userName: string;
  userEmail: string;
};
