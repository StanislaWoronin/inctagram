import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiPreconditionFailedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SubscribeDto } from '../../../apps/main-app/subscriptions/dto/subscribe.dto';
import { ErrorResponse } from '../../shared/errors.response';

export function ApiSubscribe() {
  return applyDecorators(
    ApiTags('Subscription'),
    ApiOperation({ summary: 'You can buy a paid account.' }),
    ApiBearerAuth(),
    ApiBody({ type: SubscribeDto }),
    ApiOkResponse({
      description: '',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: ErrorResponse,
    }),
    ApiUnauthorizedResponse({
      description: 'If the JWT access token is missing, expired or incorrect',
    }),
    ApiResponse({
      status: HttpStatus.EXPECTATION_FAILED,
      description: 'Transaction failed, please try again',
    }),
  );
}
