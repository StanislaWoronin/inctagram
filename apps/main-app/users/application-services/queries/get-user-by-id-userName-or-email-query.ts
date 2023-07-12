import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserQueryRepository } from '../../db.providers/user-query.repository';
import { ViewUser } from '../../view-model/user.view-model';

export class GetUserByIdOrUserNameOrEmailCommand {
  constructor(public readonly email: string) {}
}

@QueryHandler(GetUserByIdOrUserNameOrEmailCommand)
export class GetUserByIdUserNameOrEmailQuery
  implements
    IQueryHandler<
      GetUserByIdOrUserNameOrEmailCommand,
      (ViewUser & { isConfirmed: boolean }) | null
    >
{
  constructor(private userQueryRepository: UserQueryRepository) {}

  async execute(
    query: GetUserByIdOrUserNameOrEmailCommand,
  ): Promise<(ViewUser & { isConfirmed: boolean }) | null> {
    return await this.userQueryRepository.getUserByField(query.email);
  }
}
