import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserFacade } from '../users/application-services';
import {
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
import { settings } from '../../../libs/shared/settings';
import { Response } from 'express';
import { RegistrationDto } from './dto/registration.dto';
import { CurrentUser } from '../../../libs/decorators/current-user.decorator';
import { CurrentDeviceId } from '../../../libs/decorators/device-id.decorator';
import { RegistrationConfirmationDto } from './dto/registration-confirmation.dto';
import { LoginDto } from './dto/login.dto';
import { EmailDto } from './dto/email.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { ViewUser } from '../users/view-model/user.view-model';
import { TokenResponseView } from './view-model/token-response.view';
import { TCreateUserResponse } from '../users/application-services/commands/create-user.command-handler';
import { authEndpoints } from '../../../libs/shared/endpoints/auth.endpoints';
import { ConfigService } from '@nestjs/config';
import { RegistrationConfirmationResponse } from './view-model/registration-confirmation.response';
import { PasswordRecoveryDto } from './dto/password-recovery.dto';
import { UserId } from '../../../libs/decorators/user-id.decorator';
import { TLoginView } from './view-model/login.view-model';
import { CheckCredentialGuard } from '../../../libs/guards/check-credential.guard';

@Controller(authEndpoints.default())
export class AuthController {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly configService: ConfigService,
  ) {}

  @Post(authEndpoints.confirmationEmailResending())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiRegistrationEmailResending()
  async confirmationCodeResending(@Body() dto: EmailDto): Promise<boolean> {
    return await this.userFacade.commands.confirmationCodeResending(dto);
  }

  @Post(authEndpoints.login())
  @HttpCode(HttpStatus.OK)
  @UseGuards(CheckCredentialGuard)
  @ApiLogin()
  async login(
    @Body() body: LoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') title: string,
    @Res({ passthrough: true }) response: Response,
    @CurrentUser() user: ViewUser,
  ): Promise<TLoginView> {
    const dto = {
      userId: user.id,
      ...body,
      ipAddress: ipAddress,
      title: title,
    };
    const tokens = await this.userFacade.commands.loginUser(dto);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: settings.timeLife.TOKEN_TIME,
    });
    return { accessToken: tokens.accessToken, user };
  }

  @Post(authEndpoints.logout())
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiLogout()
  async logout(@CurrentDeviceId() deviceId: string): Promise<boolean> {
    return this.userFacade.commands.logout(deviceId);
  }

  @Post(authEndpoints.newPassword())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNewPassword()
  async updatePassword(@Body() dto: NewPasswordDto): Promise<boolean> {
    return await this.userFacade.commands.updatePassword(dto);
  }

  @Post(authEndpoints.passwordRecovery())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiPasswordRecovery()
  async passwordRecovery(@Body() dto: PasswordRecoveryDto): Promise<boolean> {
    return await this.userFacade.commands.passwordRecovery(dto);
  }

  @Post(authEndpoints.pairToken())
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenValidationGuard)
  @ApiRefreshToken()
  async updatePairToken(
    @UserId() userId: string,
    @CurrentDeviceId() deviceId: string,
    @Ip() ipAddress: string,
    @Headers('user-agent') title: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokenResponseView> {
    const dto = {
      userId: userId,
      deviceId: deviceId,
      ipAddress: ipAddress,
      title: title,
    };
    const tokens = await this.userFacade.commands.updatePairToken(dto);
    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: settings.timeLife.TOKEN_TIME,
    });
    return { accessToken: tokens.accessToken };
  }

  @Post(authEndpoints.registration())
  @ApiRegistration()
  async registration(
    @Body() dto: RegistrationDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TCreateUserResponse | null> {
    return await this.userFacade.commands.registrationUser(dto);
  }

  @Get(authEndpoints.registrationConfirmation())
  @HttpCode(HttpStatus.FOUND)
  @ApiRegistrationConfirmation()
  async registrationConfirmation(
    @Query() dto: RegistrationConfirmationDto,
    @Res() response: Response,
  ): Promise<boolean> {
    const isSuccess = await this.userFacade.commands.registrationConfirmation(
      dto,
    );
    const clientUrl = this.configService.get('CLIENT_URI');
    const { Success, Confirm } = RegistrationConfirmationResponse;

    if (isSuccess === Success || isSuccess === Confirm) {
      response.redirect(`${clientUrl}/ru/congratulation?status=${isSuccess}`);
    } else {
      response.redirect(`${clientUrl}/ru/resendLink?email=${isSuccess}`);
    }

    return;
  }

  @Put(authEndpoints.mergeProfile())
  @ApiMergeProfile()
  async mergeProfile(@Body() dto: RegistrationDto): Promise<ViewUser | null> {
    return await this.userFacade.commands.mergeProfile(dto);
  }
}
