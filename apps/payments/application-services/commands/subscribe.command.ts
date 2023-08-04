import { UserIdWith } from '../../../main-app/users/dto/id-with.dto';
import { SubscribeDto } from '../../../main-app/subscriptions/dto/subscribe.dto';

export class SubscribeCommand {
  constructor(public readonly dto: UserIdWith<SubscribeDto>) {}
}
