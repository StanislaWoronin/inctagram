import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../../auth/application-services/login-user.command-handler';
import { ConfirmationCodeResendingCommand } from '../../auth/application-services/confirmation-code-resending-command.handler';
import { RegistrationConfirmationCommand } from '../../auth/application-services/registration-confirmation.command-handler';
import { PasswordRecoveryCommand } from '../../auth/application-services/password-recovery.command-handler';
import {
  CreateUserCommand,
  TCreateUserResponse,
} from '../../auth/application-services/create-user.command-handler';
import { UpdatePairTokenCommand } from '../../auth/application-services/update-pair-token.command-handler';
import { UpdatePasswordCommand } from '../../auth/application-services/update-password.command-handler';
import { LogoutCommand } from '../../auth/application-services/logout-command-handler';
import { GetUserByIdOrUserNameOrEmailCommand } from './queries/get-user-by-id-userName-or-email.query';
import { GetUserByConfirmationCodeCommand } from './queries/get-user-by-confirmation-code.query';
import { GetUserByRecoveryCodeCommand } from './queries/get-user-by-recovery-code.query';
import { DeleteUserByIdCommand } from '../../auth/application-services/delete-user-by-id.command-handler';
import { SessionIdDto, WithClientMeta } from '../../auth/dto/session-id.dto';
import { LoginDto } from '../../auth/dto/login.dto';
import { EmailDto } from '../../auth/dto/email.dto';
import { RegistrationDto } from '../../auth/dto/registration.dto';
import { NewPasswordDto } from 'apps/main-app/auth/dto/new-password.dto';
import { RegistrationConfirmationDto } from '../../auth/dto/registration-confirmation.dto';
import { PairTokenDto } from '../../auth/dto/pair-token.dto';
import { ViewUser } from '../view-model/user.view-model';
import { GetViewUserWithInfoCommand } from './queries/get-view-user-with-info.query';
import { UpdateUserProfileDto } from '../dto/update-user.dto';
import { UpdateUserProfileCommand } from './commands/update-user-profile-command.handler';
import { MergeProfileCommand } from './commands/merge-profile/merge-profile.command-handler';
import { ViewUserWithInfo } from '../view-model/user-with-info.view-model';
import { UploadUserAvatarCommand } from './commands/upload-user-avatar.command-handler';
import { AvatarDto } from '../dto/avatar.dto';
import { CreatedPostView } from '../view-model/created-post.view-model';
import { CreatePostCommand } from '../../posts/application-services/create-post/create-post.command-handler';
import { MyPostsView } from '../view-model/my-posts.view-model';
import { PostIdWith, UserIdWith } from '../dto/id-with.dto';
import { MyPostQuery } from '../dto/my-post.query';
import { GetMyPostsCommand } from './queries/get-my-posts/get-my-posts.query';
import { UpdatePostCommand } from '../../posts/application-services/update-post/update-post.command-handler';
import { PostImagesDto } from '../dto/post-images.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { DeletePostDto } from '../dto/delete-post.dto';
import { DeletePostCommand } from '../../posts/application-services/delete-post/delete-post.command-handler';
import {
  RegistrationViaThirdPartyServicesDto,
  TLoginUserViaThirdPartyServices,
  TRegistrationViaThirdPartyServices,
} from '../../auth/dto/registration-via-third-party-services.dto';
import { RegistrationViaGitHubCommand } from '../../auth/application-services/registration-via-git-hub.command-handler';
import { RegistrationViaGoogleCommand } from '../../auth/application-services/registration-via-google.command-handler';
import { RegistrationConfirmationView } from '../../auth/view-model/registration-confirmation.response';
import { User } from '@prisma/client';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    confirmationCodeResending: (dto: WithClientMeta<EmailDto>) =>
      this.confirmationCodeResending(dto),
    createPost: (dto: UserIdWith<PostImagesDto>) => this.createPost(dto),
    deletePost: (dto: PostIdWith<DeletePostDto>) => this.deletePost(dto),
    deleteUserById: (userId: string) => this.deleteUserById(userId),
    loginUser: (dto: WithClientMeta<UserIdWith<LoginDto>>) =>
      this.loginUser(dto),
    logout: (deviceId: string) => this.logout(deviceId),
    mergeProfile: (dto: WithClientMeta<EmailDto>) => this.mergeProfile(dto),
    passwordRecovery: (dto: WithClientMeta<EmailDto>) =>
      this.passwordRecovery(dto),
    registrationUser: (dto: WithClientMeta<RegistrationDto>) =>
      this.registrationUser(dto),
    registrationViaGitHub: (
      dto: WithClientMeta<RegistrationViaThirdPartyServicesDto>,
    ) => this.registrationViaGitHub(dto),
    registrationViaGoogle: (
      dto: WithClientMeta<RegistrationViaThirdPartyServicesDto>,
    ) => this.registrationViaGoogle(dto),
    registrationConfirmation: (dto: RegistrationConfirmationDto) =>
      this.registrationConfirmation(dto),
    updatePost: (dto: UserIdWith<UpdatePostDto>) => this.updatePost(dto),
    updateUserProfile: (dto: UserIdWith<UpdateUserProfileDto>) =>
      this.updateUserProfile(dto),
    updatePairToken: (dto: WithClientMeta<SessionIdDto>) =>
      this.updatePairToken(dto),
    updatePassword: (data: NewPasswordDto) => this.updatePassword(data),
    uploadUserAvatar: (dto: UserIdWith<AvatarDto>) =>
      this.uploadUserAvatar(dto),
  };

  queries = {
    getMyPosts: (dto: UserIdWith<MyPostQuery>) => this.getMyPosts(dto),
    getUserByIdOrUserNameOrEmail: (loginOrEmail: string) =>
      this.getUserByIdOrUserNameOrEmail(loginOrEmail),
    getUserByConfirmationCode: (code: string) =>
      this.getUserByConfirmationCode(code),
    getUserByRecoveryCode: (code: string) => this.getUserByRecoveryCode(code),
    getUserProfile: (userId: string) => this.getUserProfile(userId),
  };

  private async createPost(
    dto: UserIdWith<PostImagesDto>,
  ): Promise<CreatedPostView> {
    const command = new CreatePostCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async deletePost(dto: PostIdWith<DeletePostDto>): Promise<boolean> {
    const command = new DeletePostCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async loginUser(
    dto: WithClientMeta<UserIdWith<LoginDto>>,
  ): Promise<PairTokenDto> {
    const command = new LoginUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async logout(deviceId: string): Promise<boolean> {
    const command = new LogoutCommand(deviceId);
    return await this.commandBus.execute(command);
  }

  private async mergeProfile(
    dto: WithClientMeta<EmailDto>,
  ): Promise<TRegistrationViaThirdPartyServices | null> {
    const command = new MergeProfileCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async confirmationCodeResending(
    dto: WithClientMeta<EmailDto>,
  ): Promise<boolean> {
    const command = new ConfirmationCodeResendingCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async registrationConfirmation(
    dto: RegistrationConfirmationDto,
  ): Promise<RegistrationConfirmationView> {
    const command = new RegistrationConfirmationCommand(dto.confirmationCode);
    return await this.commandBus.execute(command);
  }

  private async passwordRecovery(
    dto: WithClientMeta<EmailDto>,
  ): Promise<boolean> {
    const command = new PasswordRecoveryCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async registrationUser(
    dto: WithClientMeta<RegistrationDto>,
  ): Promise<TCreateUserResponse | null> {
    const command = new CreateUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async registrationViaGitHub(
    dto: WithClientMeta<RegistrationViaThirdPartyServicesDto>,
  ): Promise<TLoginUserViaThirdPartyServices> {
    const command = new RegistrationViaGitHubCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async registrationViaGoogle(
    dto: WithClientMeta<RegistrationViaThirdPartyServicesDto>,
  ): Promise<TRegistrationViaThirdPartyServices | null> {
    const command = new RegistrationViaGoogleCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async updatePairToken(
    dto: WithClientMeta<SessionIdDto>,
  ): Promise<PairTokenDto> {
    const command = new UpdatePairTokenCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async updatePassword(dto: NewPasswordDto): Promise<boolean> {
    const command = new UpdatePasswordCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async deleteUserById(id: string): Promise<boolean> {
    const command = new DeleteUserByIdCommand(id);
    return await this.commandBus.execute(command);
  }

  private async updatePost(dto: UserIdWith<UpdatePostDto>): Promise<boolean> {
    const command = new UpdatePostCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async updateUserProfile(
    dto: UserIdWith<UpdateUserProfileDto>,
  ): Promise<boolean> {
    const command = new UpdateUserProfileCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async uploadUserAvatar(dto: UserIdWith<AvatarDto>): Promise<boolean> {
    const command = new UploadUserAvatarCommand(dto);
    return await this.commandBus.execute(command);
  }

  // Queries
  private async getMyPosts(dto: UserIdWith<MyPostQuery>): Promise<MyPostsView> {
    const command = new GetMyPostsCommand(dto);
    return await this.queryBus.execute(command);
  }

  private async getUserByIdOrUserNameOrEmail(
    loginOrEmail: string,
  ): Promise<(ViewUser & { isConfirmed: boolean }) | null> {
    const command = new GetUserByIdOrUserNameOrEmailCommand(loginOrEmail);
    return await this.queryBus.execute(command);
  }

  private async getUserByConfirmationCode(code: string): Promise<User | null> {
    const command = new GetUserByConfirmationCodeCommand(code);
    return await this.queryBus.execute(command);
  }
  private async getUserByRecoveryCode(code: string): Promise<User | null> {
    const command = new GetUserByRecoveryCodeCommand(code);
    return await this.queryBus.execute(command);
  }

  private async getUserProfile(userId: string): Promise<ViewUserWithInfo> {
    const command = new GetViewUserWithInfoCommand(userId);
    return await this.queryBus.execute(command);
  }
}
