import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { subscriptionsEndpoints } from '../../../libs/shared/endpoints/subscriptions.endpoints';
import { AuthBearerGuard } from '../../../libs/guards/auth-bearer.guard';
import { ApiSubscribe } from '../../../libs/documentation/swagger/subscribe.documentation';
import { SubscribeDto } from './dto/subscribe.dto';
import { UserId } from '../../../libs/decorators/user-id.decorator';
import { SubscriptionsFacade } from './application-services/subscriptions.facade';

@Controller(subscriptionsEndpoints.default())
@UseGuards(AuthBearerGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsFacade: SubscriptionsFacade) {}

  @Post()
  @ApiSubscribe()
  async subscribe(
    @Body() dto: SubscribeDto,
    @UserId() userId: string,
  ): Promise<boolean> {
    return await this.subscriptionsFacade.commands.subscribe({
      userId,
      ...dto,
    });
  }
}
