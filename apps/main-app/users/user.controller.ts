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

@Controller(userEndpoints.default())
@UseGuards(AuthBearerGuard)
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  // Create new post with description
  @Post(userEndpoints.createPost())
  @ApiCreatePost()
  @UseInterceptors(FilesInterceptor(fileStorageConstants.post.name))
  async createPost(
    @UserId() userId: string,
    @Body() dto: PostDto,
    @UploadedFiles(new ImagesValidator()) postPhotos: Buffer[],
  ): Promise<CreatedPostView> {
    return this.userFacade.commands.createPost({
      userId,
      description: 'dto.description',
      postPhotos,
    });
  }

  // Upload user avatar
  @Post(userEndpoints.uploadUserAvatar())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUploadAvatar()
  @UseInterceptors(FileInterceptor(fileStorageConstants.avatar.name))
  async uploadUserAvatar(
    @UserId() userId: string,
    @UploadedFile(new ImageValidator())
    avatar: Buffer,
  ): Promise<boolean> {
    return await this.userFacade.commands.uploadUserAvatar({
      userId,
      avatar: avatar,
    });
  }

  // Return user profile with avatar photo
  @Get(userEndpoints.getUserProfile())
  @ApiGetUser()
  async getUserProfile(@UserId() userId: string): Promise<ViewUserWithInfo> {
    return await this.userFacade.queries.getUserProfile(userId);
  }

  // Return current user posts
  @Get(userEndpoints.myPosts())
  @ApiMyPosts()
  async getMyPosts(
    @Query() query: MyPostQuery,
    @UserId() userId: string,
  ): Promise<MyPostsView> {
    return await this.userFacade.queries.getMyPosts({
      userId,
      skip: query.skip,
    });
  }

  // Update user profile set additional info about user
  @Put(userEndpoints.updateUserProfile())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUpdateProfile()
  async updateUserProfile(
    @Body() dto: UpdateUserProfileDto,
    @UserId() userId: string,
  ): Promise<boolean> {
    return await this.userFacade.commands.updateUserProfile({ userId, ...dto });
  }

  // Update user's post
  @Put(userEndpoints.updatePost())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUpdatePost()
  async updatePost(
    @Body() dto: PostDto,
    @UserId() userId: string,
    @Param() postId: ParamsId,
  ): Promise<boolean> {
    return await this.userFacade.commands.updatePost({
      userId,
      postId: postId.id,
      description: dto.description,
    });
  }

  // Delete user post
  @Delete(userEndpoints.deletePost())
  @ApiDeletePost()
  async deletePost(
    @Body() dto: DeletePostDto,
    @Param() postId: ParamsId,
  ): Promise<boolean> {
    return this.userFacade.commands.deletePost({
      postId: postId.id,
      ...dto,
    });
  }
}
