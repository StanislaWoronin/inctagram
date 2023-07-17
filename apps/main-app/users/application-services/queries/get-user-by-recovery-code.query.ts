import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user/user-query.repository';

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
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(
    query: GetUserByRecoveryCodeCommand,
  ): Promise<{ id: string; passwordHash: string } | null> {
    return await this.userQueryRepository.getUserByRecoveryCode(query.code);
  }
}
