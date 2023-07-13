import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FileStorageQueryRepository } from '../../db.providers/file.storage.query.repository';
import { fileStorageConstants } from '../../image-validator/file-storage.constants';
import { PhotoType } from '../../../../libs/shared/enums/photo-type.enum';

export class GetMainImageCommand {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetMainImageCommand)
export class GetMainImageQuery
  implements IQueryHandler<GetMainImageCommand, string>
{
  constructor(private fileStorageQueryRepository: FileStorageQueryRepository) {}

  async execute({ userId }: GetMainImageCommand): Promise<string | null> {
    const photo = await this.fileStorageQueryRepository.getPhotosByUserId(
      userId,
      PhotoType.Avatar,
    );
    if (photo) {
      return photo.photoLink;
    }
    return fileStorageConstants.avatar.defaultLink;
  }
}
