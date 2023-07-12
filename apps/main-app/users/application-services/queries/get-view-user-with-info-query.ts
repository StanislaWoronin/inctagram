import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user-query.repository';
import { ViewUserWithInfo } from '../../view-model/user-with-info.view-model';

export class GetViewUserWithInfoCommand {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetViewUserWithInfoCommand)
export class GetViewUserWithInfoQuery
  implements
    IQueryHandler<
      GetViewUserWithInfoCommand,
      Omit<ViewUserWithInfo, 'linkToMainImage'>
    >
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(
    query: GetViewUserWithInfoCommand,
  ): Promise<Omit<ViewUserWithInfo, 'linkToMainImage'>> {
    const user = await this.userQueryRepository.getViewUserWithInfo(
      query.userId,
    );
    let birthday = null;
    if (user.birthday) birthday = new Date(user.birthday).toLocaleDateString();

    return {
      ...user,
      birthday,
    };
  }
}
