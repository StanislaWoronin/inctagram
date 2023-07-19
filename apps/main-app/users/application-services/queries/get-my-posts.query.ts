import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MyPostsView } from '../../view-model/my-posts.view-model';
import { UserQueryRepository } from '../../db.providers/user/user-query.repository';
import { UserIdWith } from '../../dto/user-with.dto';
import { MyPostQuery } from '../../dto/my-post.query';

export class GetMyPostsCommand {
  constructor(public readonly dto: UserIdWith<MyPostQuery>) {}
}

@QueryHandler(GetMyPostsCommand)
export class GetMyPostsQuery
  implements IQueryHandler<GetMyPostsCommand, MyPostsView>
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute({ dto }: GetMyPostsCommand): Promise<MyPostsView> {
    return await this.userQueryRepository.getMyPosts(dto);
  }
}
