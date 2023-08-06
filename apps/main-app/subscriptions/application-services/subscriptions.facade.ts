import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UserDataWith, UserIdWith } from '../../users/dto/id-with.dto';
import { SubscribeDto } from '../dto/subscribe.dto';
import { SubscriptionCommand } from './command/subscribe/subscription.command-handler';

@Injectable()
export class SubscriptionsFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    subscribe: (dto: UserDataWith<SubscribeDto>) => this.subscribe(dto),
  };

  queries = {};

  private async subscribe(dto: UserDataWith<SubscribeDto>): Promise<boolean> {
    const command = new SubscriptionCommand(dto);
    return await this.commandBus.execute(command);
  }
}
