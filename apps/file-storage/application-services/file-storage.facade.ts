import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateMainImageDto } from '../dto/update-main-image.dto';
import { UpdateMainImageCommand } from './commands/update-main-image.command-handler';
import { Photos } from '@prisma/client';
import { GetMainImageCommand } from './queries/get-main-image.command-handler';

@Injectable()
export class FileStorageFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    updateMainImage: (dto: Partial<UpdateMainImageDto>) =>
      this.updateMainImage(dto),
  };
  queries = {
    getMainImage: (userId: string) => this.getMainImage(userId),
  };

  // Commands
  private async updateMainImage(
    dto: Partial<UpdateMainImageDto>,
  ): Promise<boolean> {
    const command = new UpdateMainImageCommand(dto);
    return await this.commandBus.execute(command);
  }

  // Queries
  private async getMainImage(userId: string): Promise<string> {
    const command = new GetMainImageCommand(userId);
    return await this.queryBus.execute(command);
  }
}
