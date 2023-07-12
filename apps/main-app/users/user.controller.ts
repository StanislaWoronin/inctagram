import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFacade } from './application-services';
import { Microservices } from '../../../libs/shared/enums/microservices-name.enum';
import { ClientProxy } from '@nestjs/microservices';
import { Commands } from '../../../libs/shared/enums/pattern-commands-name.enum';
import { lastValueFrom, map } from 'rxjs';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMainImageDto } from '../../file-storage/dto/update-main-image.dto';
import {
  ApiGetUser,
  ApiUpdateProfile,
  ApiUpdateUser,
} from '../../../libs/documentation/swagger/user.documentation';
import { AuthBearerGuard } from '../auth/guards/auth-bearer.guard';
import { ViewUserWithInfo } from './view-model/user-with-info.view-model';
import { fileStorageConstants } from '../../file-storage/image-validator/file-storage.constants';
import { ImageValidator } from '../../file-storage/image-validator/image.validator';
import { userEndpoints } from '../../../libs/shared/endpoints/user.endpoints';

@Controller(userEndpoints.default())
export class UserController {
  constructor(
    private readonly userFacade: UserFacade,
    @Inject(Microservices.FileStorage) private authProxyClient: ClientProxy,
  ) {}

  @Get(userEndpoints.getUser())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthBearerGuard)
  @ApiGetUser()
  async getUser(@CurrentUser() userId: string): Promise<ViewUserWithInfo> {
    const user = await this.userFacade.queries.getViewUserWithInfo(userId);
    const pattern = { cmd: Commands.GetMainImage };
    user.linkToMainImage = await lastValueFrom(
      this.authProxyClient.send(pattern, userId).pipe(map((result) => result)),
    );
    return user;
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
  @ApiUpdateUser()
  @UseInterceptors(FileInterceptor(fileStorageConstants.avatar.name))
  async uploadUserAvatar(
    @CurrentUser() userId: string,
    @UploadedFile(new ImageValidator())
    mainImage: Express.Multer.File,
  ): Promise<boolean> {
    const pattern = { cmd: Commands.UpdateMainImage };
    const updateMainImageDto: Partial<UpdateMainImageDto> = {
      userId: userId,
      file: mainImage,
    };

    return await lastValueFrom(
      this.authProxyClient
        .send(pattern, updateMainImageDto)
        .pipe(map((result) => result)),
    );
  }
}
