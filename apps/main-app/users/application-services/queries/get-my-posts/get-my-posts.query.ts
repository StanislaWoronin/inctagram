import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MyPostsView } from '../../../view-model/my-posts.view-model';
import { UserQueryRepository } from '../../../db.providers/users/user.query-repository';
import { UserIdWith } from '../../../dto/id-with.dto';
import { MyPostQuery } from '../../../dto/my-post.query';
import {PostQueryRepository} from "../../../db.providers/images/post.query-repository";

export class GetMyPostsCommand {
  constructor(public readonly dto: UserIdWith<MyPostQuery>) {}
}

@QueryHandler(GetMyPostsCommand)
export class GetMyPostsQuery
  implements IQueryHandler<GetMyPostsCommand, MyPostsView>
{
  constructor(private postQueryRepository: PostQueryRepository) {}

  async execute({ dto }: GetMyPostsCommand): Promise<MyPostsView> {
    return await this.postQueryRepository.getMyPosts(dto);
  }
}
