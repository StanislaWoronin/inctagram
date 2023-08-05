import { SubscribeDto } from '../../../apps/main-app/subscriptions/dto/subscribe.dto';
import { UserIdWith } from '../../../apps/main-app/users/dto/id-with.dto';
import { IPayment } from './payment.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PayPallAdapter implements IPayment {
  async createPayment(dto: UserIdWith<SubscribeDto>) {
    return true;
  }
}
