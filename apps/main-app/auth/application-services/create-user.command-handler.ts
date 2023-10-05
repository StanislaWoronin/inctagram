import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../users/db.providers/users/user.repository';
import { EmailManager } from '../../../../libs/adapters/email.adapter';
import { UserQueryRepository } from '../../users/db.providers/users/user.query-repository';
import { RegistrationDto } from '../dto/registration.dto';
import { EmailConfirmation } from '../../users/entities/email-confirmation.entity';
import { ViewUser } from '../../users/view-model/user.view-model';
import { NewUser } from '../../users/entities/new-user.entity';
import { WithClientMeta } from '../dto/session-id.dto';

export class CreateUserCommand {
  constructor(public readonly dto: WithClientMeta<RegistrationDto>) {}
}

export type TCreateUserResponse = ViewUser | RegistrationDto;

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, TCreateUserResponse | null>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailManager: EmailManager,
  ) {}

  async execute({
    dto,
  }: CreateUserCommand): Promise<TCreateUserResponse | null> {
    const newUser = await NewUser.create(dto);
    const emailConfirmation = await EmailConfirmation.create();
    const createdUser = await this.userRepository.createUser(
      newUser,
      emailConfirmation,
    );
    this.emailManager.sendConfirmationEmail(
      createdUser.email,
      emailConfirmation.confirmationCode,
      dto.language,
    );
    return await ViewUser.toView(createdUser);
  }
}
