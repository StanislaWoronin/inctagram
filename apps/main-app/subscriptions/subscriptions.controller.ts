import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { subscriptionsEndpoints } from '../../../libs/shared/endpoints/subscriptions.endpoints';
import { AuthBearerGuard } from '../../../libs/guards/auth-bearer.guard';
import { UserFacade } from '../users/application-services';
import { ApiSubscribe } from '../../../libs/documentation/swagger/subscribe.documentation';
import { SubscribeDto } from './dto/subscribe.dto';
import { UserId } from '../../../libs/decorators/user-id.decorator';
import { config } from '../main';

@Controller(subscriptionsEndpoints.default())
@UseGuards(AuthBearerGuard)
export class SubscriptionsController {
  constructor() {}

  @Post()
  @ApiSubscribe()
  async subscribe(@Body() dto: SubscribeDto, @UserId() userId: string) {
    //const result = await this.userFacade.commands.subscribe({ userId, ...dto });
    return;
  }
}
