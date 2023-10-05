import { Type } from '@nestjs/common';
import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { RegistrationConfirmationCommandHandler } from '../../auth/application-services/registration-confirmation.command-handler';
import { PasswordRecoveryCommandHandler } from '../../auth/application-services/password-recovery.command-handler';
import { CreateUserCommandHandler } from '../../auth/application-services/create-user.command-handler';
import { LoginUserCommandHandler } from '../../auth/application-services/login-user.command-handler';
import { LogoutCommandHandler } from '../../auth/application-services/logout-command-handler';
import { ConfirmationCodeResendingCommandHandler } from '../../auth/application-services/confirmation-code-resending-command.handler';
import { UpdatePairTokenCommandHandler } from '../../auth/application-services/update-pair-token.command-handler';
import { UpdatePasswordCommandHandler } from '../../auth/application-services/update-password.command-handler';
import { GetUserByConfirmationCodeQuery } from './queries/get-user-by-confirmation-code.query';
import { GetUserByIdUserNameOrEmailQuery } from './queries/get-user-by-id-userName-or-email.query';
import { GetUserByRecoveryCodeQuery } from './queries/get-user-by-recovery-code.query';
import { DeleteUserByIdCommandHandler } from '../../auth/application-services/delete-user-by-id.command-handler';
import { GetViewUserWithInfoQuery } from './queries/get-view-user-with-info.query';
import { UpdateUserProfileCommandHandler } from './commands/update-user-profile-command.handler';
import { UploadAvatarCommandHandler } from './commands/upload-user-avatar.command-handler';
import { CreatePostCommandHandler } from '../../posts/application-services/create-post/create-post.command-handler';
import { UpdatePostCommandHandler } from '../../posts/application-services/update-post/update-post.command-handler';
import { GetMyPostsQuery } from './queries/get-my-posts/get-my-posts.query';
import { DeletePostCommandHandler } from '../../posts/application-services/delete-post/delete-post.command-handler';
import { RegistrationViaGitHubCommandHandler } from '../../auth/application-services/registration-via-git-hub.command-handler';
import { RegistrationViaGoogleCommandHandler } from '../../auth/application-services/registration-via-google.command-handler';
import { MergeProfileCommandHandler } from './commands/merge-profile/merge-profile.command-handler';

export * from './user.facade';

export const USER_COMMANDS_HANDLERS: Type<ICommandHandler>[] = [
  ConfirmationCodeResendingCommandHandler,
  CreatePostCommandHandler,
  CreateUserCommandHandler,
  DeletePostCommandHandler,
  DeleteUserByIdCommandHandler,
  LoginUserCommandHandler,
  LogoutCommandHandler,
  MergeProfileCommandHandler,
  PasswordRecoveryCommandHandler,
  RegistrationConfirmationCommandHandler,
  RegistrationViaGitHubCommandHandler,
  RegistrationViaGoogleCommandHandler,
  UpdatePairTokenCommandHandler,
  UpdatePasswordCommandHandler,
  UpdatePostCommandHandler,
  UpdateUserProfileCommandHandler,
  UploadAvatarCommandHandler,
];

export const USER_QUERIES_HANDLERS: Type<IQueryHandler>[] = [
  GetMyPostsQuery,
  GetUserByConfirmationCodeQuery,
  GetUserByIdUserNameOrEmailQuery,
  GetUserByRecoveryCodeQuery,
  GetViewUserWithInfoQuery,
];
