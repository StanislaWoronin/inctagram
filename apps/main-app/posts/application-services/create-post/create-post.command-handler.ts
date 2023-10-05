import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatedPostView } from '../../../users/view-model/created-post.view-model';
import { Inject } from '@nestjs/common';
import { Microservices } from '../../../../../libs/shared/enums/microservices-name.enum';
import { ClientProxy } from '@nestjs/microservices';
import { AvatarRepository } from '../../../users/db.providers/images/avatar.repository';
import { Commands } from '../../../../../libs/shared/enums/pattern-commands-name.enum';
import { lastValueFrom, map } from 'rxjs';
import { UserIdWith } from '../../../users/dto/id-with.dto';
import { PostImagesDto } from '../../../users/dto/post-images.dto';
import { PostRepository } from '../../../users/db.providers/images/post.repository';

export class CreatePostCommand {
  constructor(public readonly dto: UserIdWith<PostImagesDto>) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostCommandHandler
  implements ICommandHandler<CreatePostCommand, CreatedPostView>
{
  constructor(
    @Inject(Microservices.FileStorage)
    private fileStorageProxyClient: ClientProxy,
    private postRepository: PostRepository,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<CreatedPostView> {
    const pattern = { cmd: Commands.UploadPostImages };
    const postImagesLink = await lastValueFrom(
      this.fileStorageProxyClient
        .send(pattern, dto)
        .pipe(map((result) => result)),
    );

    const createdPost = await this.postRepository.savePost(
      dto.userId,
      dto.description,
      postImagesLink,
    );

    return createdPost;
  }
}
