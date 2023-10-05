import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserDataWith } from '../../main-app/users/dto/id-with.dto';
import { SubscribeDto } from '../../main-app/subscriptions/dto/subscribe.dto';
import { SubscribeCommand } from './commands/subscribe.command-handler';

@Injectable()
export class PaymentsFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    subscribe: (dto: UserDataWith<SubscribeDto>) => this.subscribe(dto),
  };

  queries = {};

  private async subscribe(dto: UserDataWith<SubscribeDto>): Promise<boolean> {
    const command = new SubscribeCommand(dto);
    return await this.commandBus.execute(command);
  }
}
