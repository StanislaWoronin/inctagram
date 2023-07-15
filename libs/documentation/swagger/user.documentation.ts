import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserProfileDto } from '../../../apps/main-app/users/dto/update-user.dto';
import { ErrorResponse } from '../../shared/errors.response';
import { ViewUserWithInfo } from '../../../apps/main-app/users/view-model/user-with-info.view-model';

export function ApiGetUser() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({ summary: 'Return user profile' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Returns user.',
      type: ViewUserWithInfo,
    }),
    ApiUnauthorizedResponse({
      description: 'If the JWT access token is missing, expired or incorrect',
    }),
  );
}

export function ApiUpdateProfile() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({
      summary: 'Update info about user.',
    }),
    ApiBearerAuth(),
    ApiBody({
      type: UpdateUserProfileDto,
    }),
    ApiNoContentResponse({
      description: 'If data is valid and data is accepted',
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with' +
        ' the given email or password already exists)',
      type: ErrorResponse,
    }),
    ApiUnauthorizedResponse({
      description: 'If the JWT access token is missing, expired or incorrect',
    }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({
      summary:
        'Update data about user,upload main image for user (.png or .jpg (.jpeg) file (max size is 1mb)',
    }),
    ApiBearerAuth(),
    ApiNoContentResponse({
      description: 'If data is valid and data is accepted',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values.',
      type: ErrorResponse,
    }),
    ApiUnauthorizedResponse({
      description: 'If the JWT access token is missing, expired or incorrect',
    }),
  );
}
