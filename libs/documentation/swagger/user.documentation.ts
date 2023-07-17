import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
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
import { CreatedPostView } from '../../../apps/main-app/users/view-model/created-post.view-model';

export function ApiCreatePost() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({ summary: 'Create new post by current user.' }),
    ApiBearerAuth(),
    ApiCreatedResponse({
      description: 'Return created post.',
      type: CreatedPostView,
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: ErrorResponse,
    }),
    ApiOperation({ summary: 'Upload image' }), // TODO test
    ApiConsumes('multipart/form-data'), // TODO test
    ApiUnauthorizedResponse({
      description: 'If the JWT access token is missing, expired or incorrect',
    }),
  );
}

export function ApiGetUser() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({ summary: 'Return user profile' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Return user.',
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

export function ApiUploadAvatar() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({
      summary: 'Upload user avatar .png or .jpg (.jpeg) file (max size is 1mb)',
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
