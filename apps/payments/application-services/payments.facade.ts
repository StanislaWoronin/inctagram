import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserIdWith } from '../../main-app/users/dto/id-with.dto';
import { SubscribeDto } from '../../main-app/subscriptions/dto/subscribe.dto';
import { SubscribeCommand } from './commands/subscribe.command';

@Injectable()
export class PaymentsFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    subscribeViaPayPall: (dto: UserIdWith<SubscribeDto>) =>
      this.subscribeViaPayPall(dto),
    subscribeViaStripe: (dto: UserIdWith<SubscribeDto>) =>
      this.subscribeViaStripe(dto),
  };

  queries = {};

  private async subscribeViaPayPall(
    dto: UserIdWith<SubscribeDto>,
  ): Promise<boolean> {
    const command = new SubscribeCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async subscribeViaStripe(
    dto: UserIdWith<SubscribeDto>,
  ): Promise<boolean> {
    const command = new SubscribeCommand(dto);
    return await this.commandBus.execute(command);
  }
}
