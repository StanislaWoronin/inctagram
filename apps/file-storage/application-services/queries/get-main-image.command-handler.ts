import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FileStorageQueryRepository } from '../../../main-app/users/db.providers/images/file.storage.query.repository';
import { fileStorageConstants } from '../../image-validator/file-storage.constants';
import { PhotoType } from '../../../../libs/shared/enums/photo-type.enum';
import { settings } from '../../../../libs/shared/settings';

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

    return `${settings.cloud.YandexCloud.BASE_URL}/${fileStorageConstants.avatar.defaultLink}`;
  }
}
