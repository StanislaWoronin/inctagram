import { Device as IDevice } from '@prisma/client';
import { randomUUID } from 'crypto';

export class Device implements IDevice {
  deviceId: string = randomUUID();

  ipAddress: string;

  title: string;

  createdAt: string;

  userId: string;

  static create(_device: Partial<Device>): Device {
    const device = new Device();
    Object.assign(device, _device);
    if (!_device.createdAt) {
      device.createdAt = new Date().toISOString();
    }
    return device;
  }
}
