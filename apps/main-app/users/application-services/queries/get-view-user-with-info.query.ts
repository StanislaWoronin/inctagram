import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user/user-query.repository';
import { ViewUserWithInfo } from '../../view-model/user-with-info.view-model';
import { decodeBirthday } from '../../../../../libs/shared/helpers';

export class GetViewUserWithInfoCommand {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetViewUserWithInfoCommand)
export class GetViewUserWithInfoQuery
  implements IQueryHandler<GetViewUserWithInfoCommand, ViewUserWithInfo>
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(query: GetViewUserWithInfoCommand): Promise<ViewUserWithInfo> {
    const user = await this.userQueryRepository.getViewUserWithInfo(
      query.userId,
    );

    return ViewUserWithInfo.toViewProfile(user);
  }
}
