import { UserDataWith } from '../../../../users/dto/id-with.dto';
import { SubscribeDto } from '../../../dto/subscribe.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { Microservices } from '../../../../../../libs/shared/enums/microservices-name.enum';
import { ClientProxy } from '@nestjs/microservices';
import { Commands } from '../../../../../../libs/shared/enums/pattern-commands-name.enum';
import { lastValueFrom, map } from 'rxjs';

export class SubscriptionCommand {
  constructor(public readonly dto: UserDataWith<SubscribeDto>) {}
}

@CommandHandler(SubscriptionCommand)
export class SubscriptionCommandHandler
  implements ICommandHandler<SubscriptionCommand, boolean>
{
  constructor(
    @Inject(Microservices.Payments)
    private paymentsProxyClient: ClientProxy,
  ) {}

  async execute({ dto }: SubscriptionCommand): Promise<boolean> {
    const pattern = { cmd: Commands.Subscribe };
    return await lastValueFrom<boolean>(
      this.paymentsProxyClient.send(pattern, dto).pipe(map((result) => result)),
    );
  }
}
