import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { subscriptionsEndpoints } from '../../../libs/shared/endpoints/subscriptions.endpoints';
import { AuthBearerGuard } from '../../../libs/guards/auth-bearer.guard';
import { ApiSubscribe } from '../../../libs/documentation/swagger/subscribe.documentation';
import { SubscribeDto } from './dto/subscribe.dto';
import { SubscriptionsFacade } from './application-services/subscriptions.facade';
import { UpdateSubscriptionTypeDto } from './dto/update-subscription-type.dto';
import { randomUUID } from 'crypto';

@Controller(subscriptionsEndpoints.default())
@UseGuards(AuthBearerGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsFacade: SubscriptionsFacade) {}

  @Get('success')
  success(): string {
    return 'Great. You bought product!';
  }

  @Get('error')
  error(): string {
    return 'Something went wrong.';
  }

  @Post()
  @ApiSubscribe()
  async subscribe(
    @Body() dto: SubscribeDto,
    // @UserData() userData: TUserData,
  ): Promise<boolean> {
    const userData = {
      userId: randomUUID(),
      userName: 'UserName',
      userEmail: 'somemail@gmail.com',
    };
    return await this.subscriptionsFacade.commands.subscribe({
      ...userData,
      ...dto,
    });
  }

  @Post()
  async updateSubscriptionType(
    @Body() dto: UpdateSubscriptionTypeDto,
  ): Promise<boolean> {
    console.log(dto);
    return true;
  }
}
