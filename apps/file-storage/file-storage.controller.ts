import { Controller } from '@nestjs/common';
import { FileStorageFacade } from './application-services';
import { MessagePattern } from '@nestjs/microservices';
import { Commands } from '../../libs/shared/enums/pattern-commands-name.enum';
import { UpdateMainImageDto } from './dto/update-main-image.dto';

@Controller()
export class FileStorageController {
  constructor(private readonly fileStorageFacade: FileStorageFacade) {}
  //
  // @MessagePattern({ cmd: Commands.UpdateMainImage })
  // async updateMainImage({
  //   userId,
  //   file,
  // }: Partial<UpdateMainImageDto>): Promise<string> {
  //   return await this.fileStorageFacade.commands.saveNewImage({
  //     userId: userId,
  //     buffer: file.buffer,
  //   });
  // }
}
