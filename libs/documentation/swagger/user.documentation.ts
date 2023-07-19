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
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { fileStorageConstants } from '../../../apps/file-storage/image-validator/file-storage.constants';
import { UpdatePostDto } from '../../../apps/main-app/users/dto/update-post.dto';
import { PostDto } from '../../../apps/main-app/users/dto/post.dto';
import {MyPostsView} from "../../../apps/main-app/users/view-model/my-posts.view-model";
import {DeletePostDto} from "../../../apps/main-app/users/dto/delete-post.dto";

export function ApiCreatePost() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({ summary: 'Create new post by current user.' }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiImplicitFile({ name: fileStorageConstants.post.name }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Return created post.',
      type: CreatedPostView,
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: ErrorResponse,
    }),
    ApiUnauthorizedResponse({
      description: 'If the JWT access token is missing, expired or incorrect',
    }),
  );
}

export function ApiDeletePost() {
  return applyDecorators(
      ApiTags('User'),
      ApiOperation({ summary: 'Delete user\'s post.' }),
      ApiBearerAuth(),
      ApiBody({
        type: DeletePostDto,
      }),
      ApiNoContentResponse(),
      ApiUnauthorizedResponse({
        description: 'If the JWT access token is missing, expired or incorrect',
      }),
  )
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

export function ApiMyPosts() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({
      summary: 'Return current user posts.',
    }),
    ApiBearerAuth(),
      ApiOkResponse({
        description: 'Return current user posts.',
        type: MyPostsView,
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

export function ApiUpdatePost() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({ summary: "Update user's post." }),
    ApiBearerAuth(),
    ApiBody({ type: PostDto }),
    ApiParam({
      name: 'postId',
      type: 'string',
    }),
    ApiNoContentResponse({
      description: 'Update is success.',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
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
    ApiConsumes('multipart/form-data'),
    ApiImplicitFile({ name: fileStorageConstants.avatar.name }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
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
