import { Injectable } from '@nestjs/common';
import { PaymentsFacade } from './application-services';
import { MessagePattern } from '@nestjs/microservices';
import { Commands } from '../../libs/shared/enums/pattern-commands-name.enum';
import { UserDataWith } from '../main-app/users/dto/id-with.dto';
import { SubscribeDto } from '../main-app/subscriptions/dto/subscribe.dto';

@Injectable()
export class PaymentsController {
  constructor(private readonly paymentsFacade: PaymentsFacade) {}

  @MessagePattern({ cmd: Commands.Subscribe })
  async subscribe(dto: UserDataWith<SubscribeDto>): Promise<string | boolean> {
    return await this.paymentsFacade.commands.subscribe(dto);
  }
}
