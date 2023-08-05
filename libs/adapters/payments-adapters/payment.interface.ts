import { SubscribeDto } from '../../../apps/main-app/subscriptions/dto/subscribe.dto';
import { UserIdWith } from '../../../apps/main-app/users/dto/id-with.dto';

export interface IPayment {
  createPayment(dto: UserIdWith<SubscribeDto>);
}
