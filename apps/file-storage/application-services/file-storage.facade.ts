import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateAvatarDto } from '../../main-app/users/dto/update-avatar.dto';
import { UpdateAvatarCommand } from './commands/update-avatar-command.handler';
import {UploadPostImagesDto} from "../../main-app/users/dto/create-post.dto";
import {UploadPostImagesCommand} from "./commands/upload-post-image.command-handler";

@Injectable()
export class FileStorageFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    updateAvatar: (dto: UpdateAvatarDto) =>
      this.updateAvatar(dto),
    uploadPostImage: (dto: UploadPostImagesDto) => this.uploadPostImage(dto)
  };
  queries = {
    //getMainImage: (userId: string) => this.getMainImage(userId),
  };

  // Commands
  private async updateAvatar(
    dto: UpdateAvatarDto,
  ): Promise<string> {
    const command = new UpdateAvatarCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async uploadPostImage(
      dto: UploadPostImagesDto,
  ): Promise<string[]> {
    const command = new UploadPostImagesCommand(dto)
    return await this.commandBus.execute(command)
  }

  // Queries
}
