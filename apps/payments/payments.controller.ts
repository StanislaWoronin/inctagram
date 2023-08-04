import { Injectable } from '@nestjs/common';
import { PaymentsFacade } from './application-services';
import { MessagePattern } from '@nestjs/microservices';
import { Commands } from '../../libs/shared/enums/pattern-commands-name.enum';
import { UserIdWith } from '../main-app/users/dto/id-with.dto';
import { SubscribeDto } from '../main-app/subscriptions/dto/subscribe.dto';

@Injectable()
export class PaymentsController {
  constructor(private readonly paymentsFacade: PaymentsFacade) {}

  @MessagePattern({ cmd: Commands.SubscribePayPall })
  async subscribeViaPayPall(dto: UserIdWith<SubscribeDto>): Promise<boolean> {
    return await this.paymentsFacade.commands.subscribeViaPayPall(dto);
  }

  @MessagePattern({ cmd: Commands.SubscribePayPall })
  async subscribeViaStripe(dto: UserIdWith<SubscribeDto>): Promise<boolean> {
    return await this.paymentsFacade.commands.subscribeViaPayPall(dto);
  }
}
