import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserFacade } from '../users/application-services';
import {
  ApiGitHubRegistration,
  ApiGoogleRegistration,
  ApiLogin,
  ApiLogout,
  ApiMergeProfile,
  ApiNewPassword,
  ApiPasswordRecovery,
  ApiRefreshToken,
  ApiRegistration,
  ApiRegistrationConfirmation,
  ApiRegistrationEmailResending,
} from '../../../libs/documentation/swagger/auth.documentation';
import { RefreshTokenValidationGuard } from '../../../libs/guards/refresh-token-validation.guard';
import { RegistrationDto } from './dto/registration.dto';
import { CurrentUser } from '../../../libs/decorators/current-user.decorator';
import { CurrentDeviceId } from '../../../libs/decorators/device-id.decorator';
import { RegistrationConfirmationDto } from './dto/registration-confirmation.dto';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { ViewUser } from '../users/view-model/user.view-model';
import { TokenResponseView } from './view-model/token-response.view';
import { TCreateUserResponse } from './application-services/create-user.command-handler';
import { authEndpoints } from '../../../libs/shared/endpoints/auth.endpoints';
import { RegistrationConfirmationView } from './view-model/registration-confirmation.response';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { UserId } from '../../../libs/decorators/user-id.decorator';
import { LoginView, TLoginView } from './view-model/login.view-model';
import { CheckCredentialGuard } from '../../../libs/guards/check-credential.guard';
import {
  RegistrationViaThirdPartyServicesDto,
  TLoginUserViaThirdPartyServices,
} from './dto/registration-via-third-party-services.dto';
import { SetCookiesInterceptor } from '../../../libs/interceptos/set-cookies.interceptor';
import {
  IMetadata,
  Metadata,
} from '../../../libs/decorators/metadata.decorator';
import { ViewUserWithInfo } from '../users/view-model/user-with-info.view-model';

@Controller(authEndpoints.default())
@UseInterceptors(SetCookiesInterceptor)
export class AuthController {
  constructor(private readonly userFacade: UserFacade) {}

  // Confirmation email vie confirmation code from email
  @Post(authEndpoints.confirmationEmailResending())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationEmailResending()
  async confirmationCodeResending(
    @Body() dto: EmailDto,
    @Metadata() meta: IMetadata,
  ): Promise<boolean> {
    return await this.userFacade.commands.confirmationCodeResending({
      ...dto,
      ...meta,
    });
  }

  // Log in
  @Post(authEndpoints.login())
  @HttpCode(HttpStatus.OK)
  @UseGuards(CheckCredentialGuard)
  @ApiLogin()
  async login(
    @Body() body: LoginDto,
    @CurrentUser() user: ViewUserWithInfo,
    @Metadata() meta: IMetadata,
  ): Promise<LoginView> {
    const dto = {
      userId: user.id,
      ...body,
      ...meta,
    };
    const tokens = await this.userFacade.commands.loginUser(dto);

    return { ...tokens, user };
  }

  // Logout session by id
  @Post(authEndpoints.logout())
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiLogout()
  async logout(
    @CurrentDeviceId() deviceId: string,
    @Metadata() meta: IMetadata,
  ): Promise<boolean> {
    return await this.userFacade.commands.logout(deviceId);
  }

  // Set new password
  @Post(authEndpoints.newPassword())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNewPassword()
  async updatePassword(
    @Body() dto: NewPasswordDto,
    @Metadata() meta: IMetadata,
  ): Promise<boolean> {
    return await this.userFacade.commands.updatePassword(dto);
  }

  // Create and send email with password recovery
  @Post(authEndpoints.passwordRecovery())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiPasswordRecovery()
  async passwordRecovery(
    @Body() dto: PasswordRecoveryDto,
    @Metadata() meta: IMetadata,
  ): Promise<boolean> {
    return await this.userFacade.commands.passwordRecovery({ ...dto, ...meta });
  }

  // Generate new pair tokens
  @Post(authEndpoints.pairToken())
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiRefreshToken()
  async updatePairToken(
    @UserId() userId: string,
    @CurrentDeviceId() deviceId: string,
    @Metadata() meta: IMetadata,
  ): Promise<TokenResponseView> {
    const dto = {
      userId,
      deviceId,
      ...meta,
    };
    return await this.userFacade.commands.updatePairToken(dto);
  }

  // Registration in the system
  @Post(authEndpoints.registration())
  @ApiRegistration()
  async registration(
    @Body() dto: RegistrationDto,
    @Metadata() meta: IMetadata,
  ): Promise<TCreateUserResponse | null> {
    return await this.userFacade.commands.registrationUser({ ...dto, ...meta });
  }

  // Registration in the system via GitHub and return pair tokens
  @Get(authEndpoints.registrationViaGitHub())
  @ApiGitHubRegistration()
  async registrationViaGitHub(
    @Metadata() meta: IMetadata,
    @Query() query: RegistrationViaThirdPartyServicesDto,
    //@Res() response: Response,
  ): Promise<TLoginUserViaThirdPartyServices> {
    const dto = {
      ...meta,
      ...query,
    };

    return await this.userFacade.commands.registrationViaGitHub(dto);
  }

  // Registration in the system via Google and return pair tokens
  @Get(authEndpoints.registrationViaGoogle())
  @ApiGoogleRegistration()
  async registrationViaGoogle(
    @Metadata() meta: IMetadata,
    @Query() query: RegistrationViaThirdPartyServicesDto,
  ): Promise<TLoginView> {
    const dto = {
      ...meta,
      ...query,
    };
    return await this.userFacade.commands.registrationViaGoogle(dto);
  }

  // Confirmation email vie code from email
  @Get(authEndpoints.registrationConfirmation())
  @HttpCode(HttpStatus.OK)
  @ApiRegistrationConfirmation()
  async registrationConfirmation(
    @Metadata() meta: IMetadata,
    @Query() dto: RegistrationConfirmationDto,
  ): Promise<RegistrationConfirmationView> {
    return this.userFacade.commands.registrationConfirmation(dto);
  }

  // Merge profile if users with this email already exists but email is not confirmed
  @Put(authEndpoints.mergeProfile())
  @ApiMergeProfile()
  async mergeProfile(
    @Body() body: EmailDto,
    @Metadata() meta: IMetadata,
  ): Promise<TLoginView | null> {
    const dto = {
      ...body,
      ...meta,
    };
    return await this.userFacade.commands.mergeProfile(dto);
  }
}
