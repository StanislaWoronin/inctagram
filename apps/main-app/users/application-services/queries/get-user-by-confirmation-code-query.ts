import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user-query.repository';
import { ViewUser } from '../../view-model/user.view-model';

export class GetUserByConfirmationCodeCommand {
  constructor(public readonly code: string) {}
}

@QueryHandler(GetUserByConfirmationCodeCommand)
export class GetUserByConfirmationCodeQuery
  implements IQueryHandler<GetUserByConfirmationCodeCommand, ViewUser | null>
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(
    query: GetUserByConfirmationCodeCommand,
  ): Promise<ViewUser | null> {
    return await this.userQueryRepository.getUserByConfirmationCode(query.code);
  }
}
