import { Controller } from '@nestjs/common';
import { FileStorageFacade } from './application-services';
import { MessagePattern } from '@nestjs/microservices';
import { Commands } from '../../libs/shared/enums/pattern-commands-name.enum';
import { UpdateAvatarDto } from '../main-app/users/dto/update-avatar.dto';
import {UploadPostImagesDto} from "../main-app/users/dto/create-post.dto";

@Controller()
export class FileStorageController {
  constructor(private readonly fileStorageFacade: FileStorageFacade) {}

  @MessagePattern({ cmd: Commands.UploadPostImages})
  async uploadPostImages(dto: UploadPostImagesDto): Promise<string[]> {
    return await this.fileStorageFacade.commands.uploadPostImage(dto)
  }

  @MessagePattern({ cmd: Commands.UpdateAvatar })
  async updateAvatar(dto: UpdateAvatarDto): Promise<string> {
    return await this.fileStorageFacade.commands.updateAvatar(dto);
  }
}
