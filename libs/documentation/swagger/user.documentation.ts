import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
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
import { fileStorageConstants } from '../../../apps/file-storage/image-validator/file-storage.constants';
import { PostDto } from '../../../apps/main-app/users/dto/post.dto';
import { MyPostsView } from '../../../apps/main-app/users/view-model/my-posts.view-model';
import { DeletePostDto } from '../../../apps/main-app/users/dto/delete-post.dto';
import { CreatePostDto } from '../../../apps/main-app/users/dto/create-post.dto';
import { settings } from '../../shared/settings';

export function ApiCreatePost() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({ summary: 'Create new post by current users.' }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    // ApiImplicitFile({
    //   name: fileStorageConstants.post.name,
    //   description: `Нou can upload up to ${settings.uploadFile.maxPostCount} photos`,
    // }),
    ApiBody({ type: CreatePostDto }),
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
    ApiOperation({ summary: "Delete users's post." }),
    ApiBearerAuth(),
    ApiBody({
      type: DeletePostDto,
    }),
    ApiNoContentResponse(),
    ApiUnauthorizedResponse({
      description: 'If the JWT access token is missing, expired or incorrect',
    }),
    ApiNotFoundResponse({ description: 'Post for specific ID not found' }),
  );
}

export function ApiGetUser() {
  return applyDecorators(
    ApiTags('User'),
    ApiOperation({ summary: 'Return users profile' }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Return users.',
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
      summary: 'Return current users posts.',
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Return current users posts.',
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
      summary: 'Update users profile. Set additional info about users.',
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
        'If the inputModel has incorrect values (in particular if the users with' +
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
    ApiOperation({ summary: "Update users's post." }),
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
      summary:
        'Upload users avatar .png or .jpg (.jpeg) file (max size is 1mb)',
    }),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    // ApiImplicitFile({ name: fileStorageConstants.avatar.name }),
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
