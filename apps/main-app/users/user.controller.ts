import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../../../libs/decorators/current-user.decorator';
import { UserFacade } from './application-services';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatePost,
  ApiGetUser,
  ApiUpdateProfile,
  ApiUploadAvatar,
} from '../../../libs/documentation/swagger/user.documentation';
import { AuthBearerGuard } from '../../../libs/guards/auth-bearer.guard';
import { ViewUserWithInfo } from './view-model/user-with-info.view-model';
import { fileStorageConstants } from '../../file-storage/image-validator/file-storage.constants';
import { ImageValidator } from '../../file-storage/image-validator/image.validator';
import { userEndpoints } from '../../../libs/shared/endpoints/user.endpoints';
import { CreatePostDto } from './dto/create-post.dto';
import { CreatedPostView } from './view-model/created-post.view-model';
import { ImagesValidator } from '../../file-storage/image-validator/images.validator';

@Controller(userEndpoints.default())
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Post(userEndpoints.createPost())
  @UseGuards(AuthBearerGuard)
  @ApiCreatePost()
  @UseInterceptors(FilesInterceptor(fileStorageConstants.post.name))
  async createPost(
    @CurrentUser() userId: string,
    @Body() dto: CreatePostDto,
    @UploadedFiles(new ImagesValidator()) postPhotos: Buffer[],
  ): Promise<CreatedPostView> {
    return this.userFacade.commands.createPost({
      userId,
      description: 'dto.description',
      postPhotos,
    });
  }

  @Get(userEndpoints.getUserProfile())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthBearerGuard)
  @ApiGetUser()
  async getUserProfile(
    @CurrentUser() userId: string,
  ): Promise<ViewUserWithInfo> {
    return await this.userFacade.queries.getUserProfile(userId);
  }

  @Put(userEndpoints.updateUserProfile())
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthBearerGuard)
  @ApiUpdateProfile()
  async updateUserProfile(
    @Body() dto: UpdateUserProfileDto,
    @CurrentUser() userId: string,
  ): Promise<boolean> {
    return await this.userFacade.commands.updateUserProfile(dto, userId);
  }

  @Post(userEndpoints.uploadUserAvatar())
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthBearerGuard)
  @ApiUploadAvatar()
  @UseInterceptors(FileInterceptor(fileStorageConstants.avatar.name))
  async uploadUserAvatar(
    @CurrentUser() userId: string,
    @UploadedFile(new ImageValidator())
    avatar: Buffer,
  ): Promise<boolean> {
    return await this.userFacade.commands.uploadUserAvatar({
      userId,
      file: avatar,
    });
  }
}
