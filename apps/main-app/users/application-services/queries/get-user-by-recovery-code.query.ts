import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/users/user.query-repository';
import { ProfileQueryRepository } from '../../db.providers/profile/profile.query-repository';

export class GetUserByRecoveryCodeCommand {
  constructor(public readonly code: string) {}
}

@QueryHandler(GetUserByRecoveryCodeCommand)
export class GetUserByRecoveryCodeQuery
  implements
    IQueryHandler<
      GetUserByRecoveryCodeCommand,
      { id: string; passwordHash: string } | null
    >
{
  constructor(private profileQueryRepository: ProfileQueryRepository) {}

  async execute(
    query: GetUserByRecoveryCodeCommand,
  ): Promise<{ id: string; passwordHash: string } | null> {
    return await this.profileQueryRepository.getUserByRecoveryCode(query.code);
  }
}
