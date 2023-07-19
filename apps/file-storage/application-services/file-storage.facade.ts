import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AvatarDto } from '../../main-app/users/dto/avatar.dto';
import { UpdateAvatarCommand } from './commands/update-avatar-command.handler';
import { UploadPostImagesCommand } from './commands/upload-post-image.command-handler';
import { UserIdWith } from '../../main-app/users/dto/user-with.dto';
import { PostImagesDto } from '../../main-app/users/dto/post-images.dto';

@Injectable()
export class FileStorageFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    updateAvatar: (dto: UserIdWith<AvatarDto>) => this.updateAvatar(dto),
    uploadPostImage: (dto: UserIdWith<PostImagesDto>) =>
      this.uploadPostImage(dto),
  };
  queries = {
    //getMainImage: (userId: string) => this.getMainImage(userId),
  };

  // Commands
  private async updateAvatar(dto: UserIdWith<AvatarDto>): Promise<string> {
    const command = new UpdateAvatarCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async uploadPostImage(
    dto: UserIdWith<PostImagesDto>,
  ): Promise<string[]> {
    const command = new UploadPostImagesCommand(dto);
    return await this.commandBus.execute(command);
  }

  // Queries
}
