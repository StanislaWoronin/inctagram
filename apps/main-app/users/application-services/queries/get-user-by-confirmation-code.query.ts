import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/users/user.query-repository';
import { ViewUser } from '../../view-model/user.view-model';
import { ProfileQueryRepository } from '../../db.providers/profile/profile.query-repository';

export class GetUserByConfirmationCodeCommand {
  constructor(public readonly code: string) {}
}

@QueryHandler(GetUserByConfirmationCodeCommand)
export class GetUserByConfirmationCodeQuery
  implements IQueryHandler<GetUserByConfirmationCodeCommand, ViewUser | null>
{
  constructor(private profileQueryRepository: ProfileQueryRepository) {}

  async execute(
    query: GetUserByConfirmationCodeCommand,
  ): Promise<ViewUser | null> {
    return await this.profileQueryRepository.getUserByConfirmationCode(
      query.code,
    );
  }
}
