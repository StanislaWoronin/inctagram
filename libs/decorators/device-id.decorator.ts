import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentDeviceId = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.deviceId) {
      return null;
    }

    return request.deviceId;
  },
);
