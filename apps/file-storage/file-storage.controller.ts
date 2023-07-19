import { Controller } from '@nestjs/common';
import { FileStorageFacade } from './application-services';
import { MessagePattern } from '@nestjs/microservices';
import { Commands } from '../../libs/shared/enums/pattern-commands-name.enum';
import { AvatarDto } from '../main-app/users/dto/avatar.dto';
import { PostImagesDto } from '../main-app/users/dto/post-images.dto';
import { UserIdWith } from '../main-app/users/dto/user-with.dto';

@Controller()
export class FileStorageController {
  constructor(private readonly fileStorageFacade: FileStorageFacade) {}

  @MessagePattern({ cmd: Commands.UploadPostImages })
  async uploadPostImages(dto: UserIdWith<PostImagesDto>): Promise<string[]> {
    return await this.fileStorageFacade.commands.uploadPostImage(dto);
  }

  @MessagePattern({ cmd: Commands.UpdateAvatar })
  async updateAvatar(dto: UserIdWith<AvatarDto>): Promise<string> {
    return await this.fileStorageFacade.commands.updateAvatar(dto);
  }
}
