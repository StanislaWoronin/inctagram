import { Device } from '@prisma/client';
import { IMetadata } from '../../../../libs/decorators/metadata.decorator';

type TSessionIdDto = Pick<Device, 'userId' | 'deviceId'>;

export class SessionIdDto implements TSessionIdDto {
  userId: string;
  deviceId: string;
}

export type ClientMeta = { ipAddress: string; title: string };
export type WithClientMeta<T> = T & IMetadata;
