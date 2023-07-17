import { Type } from '@nestjs/common';
import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { RegistrationConfirmationCommandHandler } from './commands/registration-confirmation.command-handler';
import { PasswordRecoveryCommandHandler } from './commands/password-recovery.command-handler';
import { CreateUserCommandHandler } from './commands/create-user.command-handler';
import { LoginUserCommandHandler } from './commands/login-user.command-handler';
import { LogoutCommandHandler } from './commands/logout-command-handler';
import { ConfirmationCodeResendingCommandHandler } from './commands/confirmation-code-resending-command.handler';
import { UpdatePairTokenCommandHandler } from './commands/update-pair-token.command-handler';
import { UpdatePasswordCommandHandler } from './commands/update-password.command-handler';
import { GetUserByConfirmationCodeQuery } from './queries/get-user-by-confirmation-code.query';
import { GetUserByIdUserNameOrEmailQuery } from './queries/get-user-by-id-userName-or-email.query';
import { GetUserByRecoveryCodeQuery } from './queries/get-user-by-recovery-code.query';
import { DeleteUserByIdCommandHandler } from './commands/delete-user-by-id.command-handler';
import { GetViewUserWithInfoQuery } from './queries/get-view-user-with-info.query';
import { UpdateUserProfileCommandHandler } from './commands/update-user-profile-command.handler';
import { UploadAvatarCommandHandler } from './commands/upload-user-avatar.command-handler';

export * from './user.facade';

export const USER_COMMANDS_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  LoginUserCommandHandler,
  LogoutCommandHandler,
  ConfirmationCodeResendingCommandHandler,
  RegistrationConfirmationCommandHandler,
  PasswordRecoveryCommandHandler,
  UpdatePairTokenCommandHandler,
  UpdatePasswordCommandHandler,
  DeleteUserByIdCommandHandler,
  UpdateUserProfileCommandHandler,
  UploadAvatarCommandHandler,
];

export const USER_QUERIES_HANDLERS: Type<IQueryHandler>[] = [
  GetUserByIdUserNameOrEmailQuery,
  GetUserByConfirmationCodeQuery,
  GetUserByRecoveryCodeQuery,
  GetViewUserWithInfoQuery,
];
