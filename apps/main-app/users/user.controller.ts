import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserFacade } from './application-services';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatePost,
  ApiDeletePost,
  ApiGetUser,
  ApiMyPosts,
  ApiUpdatePost,
  ApiUpdateProfile,
  ApiUploadAvatar,
} from '../../../libs/documentation/swagger/user.documentation';
import { AuthBearerGuard } from '../../../libs/guards/auth-bearer.guard';
import { ViewUserWithInfo } from './view-model/user-with-info.view-model';
import { fileStorageConstants } from '../../file-storage/image-validator/file-storage.constants';
import { ImageValidator } from '../../file-storage/image-validator/image.validator';
import { userEndpoints } from '../../../libs/shared/endpoints/user.endpoints';
import { PostDto } from './dto/post.dto';
import { CreatedPostView } from './view-model/created-post.view-model';
import { ImagesValidator } from '../../file-storage/image-validator/images.validator';
import { MyPostQuery } from './dto/my-post.query';
import { MyPostsView } from './view-model/my-posts.view-model';
import { DeletePostDto } from './dto/delete-post.dto';
import { ParamsId } from '../../../libs/shared/dto/params-id';
import { UserId } from '../../../libs/decorators/user-id.decorator';
import {
  IMetadata,
  Metadata,
} from '../../../libs/decorators/metadata.decorator';

@Controller(userEndpoints.default())
@UseGuards(AuthBearerGuard)
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  // Create new post with description
  @Post(userEndpoints.createPost())
  @ApiCreatePost()
  @UseInterceptors(FilesInterceptor(fileStorageConstants.post.name))
  async createPost(
    @Body() dto: PostDto,
    @Metadata() meta: IMetadata,
    @UploadedFiles(new ImagesValidator()) postPhotos: Buffer[],
    @UserId() userId: string,
  ): Promise<CreatedPostView> {
    return this.userFacade.commands.createPost({
      userId,
      description: 'dto.description',
      postPhotos,
    });
  }

  // Upload users avatar
  @Post(userEndpoints.uploadUserAvatar())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUploadAvatar()
  @UseInterceptors(FileInterceptor(fileStorageConstants.avatar.name))
  async uploadUserAvatar(
    @Metadata() meta: IMetadata,
    @UploadedFile(new ImageValidator()) avatar: Buffer,
    @UserId() userId: string,
  ): Promise<boolean> {
    return await this.userFacade.commands.uploadUserAvatar({
      userId,
      avatar: avatar,
    });
  }

  // Return users profile with avatar photo
  @Get(userEndpoints.getUserProfile())
  @ApiGetUser()
  async getUserProfile(
    @Metadata() meta: IMetadata,
    @UserId() userId: string,
  ): Promise<ViewUserWithInfo> {
    return await this.userFacade.queries.getUserProfile(userId);
  }

  // Return current users posts
  @Get(userEndpoints.myPosts())
  @ApiMyPosts()
  async getMyPosts(
    @Query() query: MyPostQuery,
    @Metadata() meta: IMetadata,
    @UserId() userId: string,
  ): Promise<MyPostsView> {
    return await this.userFacade.queries.getMyPosts({
      userId,
      ...query,
    });
  }

  // Update users profile set additional info about users
  @Put(userEndpoints.updateUserProfile())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUpdateProfile()
  async updateUserProfile(
    @Body() dto: UpdateUserProfileDto,
    @Metadata() meta: IMetadata,
    @UserId() userId: string,
  ): Promise<boolean> {
    return await this.userFacade.commands.updateUserProfile({ userId, ...dto });
  }

  // Update users's post
  @Put(userEndpoints.updatePost())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUpdatePost()
  async updatePost(
    @Body() dto: PostDto,
    @Metadata() meta: IMetadata,
    @Param() postId: ParamsId,
    @UserId() userId: string,
  ): Promise<boolean> {
    return await this.userFacade.commands.updatePost({
      userId,
      postId: postId.id,
      description: dto.description,
    });
  }

  // Delete users post
  @Delete(userEndpoints.deletePost())
  @ApiDeletePost()
  async deletePost(
    @Body() dto: DeletePostDto,
    @Metadata() meta: IMetadata,
    @Param() postId: ParamsId,
  ): Promise<boolean> {
    return this.userFacade.commands.deletePost({
      postId: postId.id,
      ...dto,
    });
  }
}
