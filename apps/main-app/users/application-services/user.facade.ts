import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginUserCommand } from './commands/login-user.command-handler';
import { ConfirmationCodeResendingCommand } from './commands/confirmation-code-resending-command.handler';
import { RegistrationConfirmationCommand } from './commands/registration-confirmation.command-handler';
import { PasswordRecoveryCommand } from './commands/password-recovery.command-handler';
import {
  CreateUserCommand,
  TCreateUserResponse,
} from './commands/create-user.command-handler';
import { UpdatePairTokenCommand } from './commands/update-pair-token.command-handler';
import { UpdatePasswordCommand } from './commands/update-password.command-handler';
import { LogoutCommand } from './commands/logout-command-handler';
import { GetUserByIdOrUserNameOrEmailCommand } from './queries/get-user-by-id-userName-or-email-query';
import { GetUserByConfirmationCodeCommand } from './queries/get-user-by-confirmation-code-query';
import { GetUserByRecoveryCodeCommand } from './queries/get-user-by-recovery-code-query';
import { DeleteUserByIdCommand } from './commands/delete-user-by-id.command-handler';
import { SessionIdDto, WithClientMeta } from '../../auth/dto/session-id.dto';
import { LoginDto } from '../../auth/dto/login.dto';
import { EmailDto } from '../../auth/dto/email.dto';
import { RegistrationDto } from '../../auth/dto/registration.dto';
import { NewPasswordDto } from 'apps/main-app/auth/dto/new-password.dto';
import { RegistrationConfirmationDto } from '../../auth/dto/registration-confirmation.dto';
import { User } from '@prisma/client';
import { PairTokenDto } from '../../auth/dto/pair-token.dto';
import { ViewUser } from '../view-model/user.view-model';
import { GetViewUserWithInfoCommand } from './queries/get-view-user-with-info-query';
import { UpdateUserProfileDto } from '../dto/update-user.dto';
import { UpdateUserProfileCommand } from './commands/update-user-profile-command.handler';
import { MergeProfileCommand } from './commands/merge-profile.command-handler';
import { ViewUserWithInfo } from '../view-model/user-with-info.view-model';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    loginUser: (dto: WithClientMeta<LoginDto>) => this.loginUser(dto),
    logout: (deviceId: string) => this.logout(deviceId),
    mergeProfile: (dto: RegistrationDto) => this.mergeProfile(dto),
    passwordRecovery: (dto: EmailDto) => this.passwordRecovery(dto),
    registrationUser: (dto: RegistrationDto) => this.registrationUser(dto),
    updatePairToken: (dto: WithClientMeta<SessionIdDto>) =>
      this.updatePairToken(dto),
    updatePassword: (data: NewPasswordDto) => this.updatePassword(data),
    confirmationCodeResending: (dto: EmailDto) =>
      this.confirmationCodeResending(dto),
    registrationConfirmation: (dto: RegistrationConfirmationDto) =>
      this.registrationConfirmation(dto),
    deleteUserById: (id: string) => this.deleteUserById(id),
    updateUserProfile: (dto: UpdateUserProfileDto, userId: string) =>
      this.updateUserProfile(dto, userId),
  };
  queries = {
    getUserByIdOrUserNameOrEmail: (loginOrEmail: string) =>
      this.getUserByIdOrUserNameOrEmail(loginOrEmail),
    getUserByConfirmationCode: (code: string) =>
      this.getUserByConfirmationCode(code),
    getUserByRecoveryCode: (code: string) => this.getUserByRecoveryCode(code),
    getViewUserWithInfo: (id: string) => this.getViewUserWithInfo(id),
  };

  private async loginUser(
    dto: WithClientMeta<LoginDto>,
  ): Promise<PairTokenDto> {
    const command = new LoginUserCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async logout(deviceId: string): Promise<boolean> {
    const command = new LogoutCommand(deviceId);
    return await this.commandBus.execute(command);
  }

  private async mergeProfile(dto: RegistrationDto): Promise<ViewUser | null> {
    const command = new MergeProfileCommand(dto);
    return await this.commandBus.execute(command);
  }

  private async confirmationCodeResending(dto: EmailDto): Promise<boolean> {
    const command = new ConfirmationCodeResendingCommand(dto.email);
    return await this.commandBus.execute(command);
  }

  private async registrationConfirmation(
    dto: RegistrationConfirmationDto,
  ): Promise<string> {
    const command = new RegistrationConfirmationCommand(dto.confirmationCode);
    return await this.commandBus.execute(command);
  }

  private async passwordRecovery(dto: EmailDto): Promise<boolean> {
    const command = new PasswordRecoveryCommand(dto.email);
    return await this.commandBus.execute(command);
  }

  private async registrationUser(
    dto: RegistrationDto,
  ): Promise<TCreateUserResponse | null> {
    const command = new CreateUserCommand(dto);
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

  private async updateUserProfile(
    dto: UpdateUserProfileDto,
    userId: string,
  ): Promise<boolean> {
    const command = new UpdateUserProfileCommand(dto, userId);
    return await this.commandBus.execute(command);
  }

  //Queries
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

  private async getViewUserWithInfo(userId: string): Promise<ViewUserWithInfo> {
    const command = new GetViewUserWithInfoCommand(userId);
    return await this.queryBus.execute(command);
  }
}
