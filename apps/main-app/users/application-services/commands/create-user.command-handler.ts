import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../db.providers/user.repository';
import { EmailManager } from '../../../../../libs/adapters/email.adapter';
import { UserQueryRepository } from '../../db.providers/user-query.repository';
import { BadRequestException } from '@nestjs/common';
import { RegistrationDto } from '../../../auth/dto/registration.dto';
import { EmailConfirmation } from '../../entities/email-confirmation.entity';
import { ViewUser } from '../../view-model/user.view-model';
import { NewUser } from '../../entities/new-user.entity';

export class CreateUserCommand {
  constructor(public readonly dto: RegistrationDto) {}
}

export type TCreateUserResponse = ViewUser | RegistrationDto;

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, TCreateUserResponse | null>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userQueryRepository: UserQueryRepository,
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
    );
    return await ViewUser.create(createdUser);
  }
}
