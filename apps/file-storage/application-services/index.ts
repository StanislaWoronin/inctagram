import { Type } from '@nestjs/common';
import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateAvatarCommandHandler } from './commands/update-avatar-handler/update-avatar-command.handler';
import { UploadPostImagesCommandHandler } from './commands/upload-post-handler/upload-post-image.command-handler';

export * from './file-storage.facade';

export const FILE_STORAGE_COMMANDS_HANDLERS: Type<ICommandHandler>[] = [
  UpdateAvatarCommandHandler,
  UploadPostImagesCommandHandler,
];

export const FILE_STORAGE_QUERIES_HANDLERS: Type<IQueryHandler>[] = [];
