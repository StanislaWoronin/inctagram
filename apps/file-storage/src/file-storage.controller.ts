import { Controller } from '@nestjs/common';
import { FileStorageFacade } from '../application-services';
import { MessagePattern } from '@nestjs/microservices';
import { Commands } from '../../../libs/shared/enums/pattern-commands-name.enum';
import { UpdateMainImageDto } from '../dto/update-main-image.dto';

@Controller()
export class FileStorageController {
  constructor(private readonly fileStorageFacade: FileStorageFacade) {}

  @MessagePattern({ cmd: Commands.UpdateMainImage })
  async updateMainImage({
    userId,
    file,
  }: Partial<UpdateMainImageDto>): Promise<boolean> {
    const result = await this.fileStorageFacade.commands.updateMainImage({
      userId: userId,
      buffer: file.buffer,
    });
    return !!result;
  }

  @MessagePattern({ cmd: Commands.GetMainImage })
  async getMainImage(userId: string): Promise<string> {
    return await this.fileStorageFacade.queries.getMainImage(userId);
  }
}
