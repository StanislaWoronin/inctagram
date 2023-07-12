import { Device } from '@prisma/client';

type TSessionIdDto = Pick<Device, 'userId' | 'deviceId'>;

export class SessionIdDto implements TSessionIdDto {
  userId: string;
  deviceId: string;
}

export type WithClientMeta<T> = T & { ipAddress: string; title: string };
