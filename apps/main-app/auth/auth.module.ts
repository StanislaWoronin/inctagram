import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { IsConfirmationCodeExistConstraint } from '../../../libs/decorators/confirmation-code.decorator';
import { IsUserNameExistConstraint } from '../../../libs/decorators/user-name-exists.decorator';
import {
  IsEmailExistConstraint,
  IsEmailExistForRegistrationConstraint,
  IsEmailForPasswordRecoveryExistConstraint,
} from '../../../libs/decorators/email.decorator';
import { IsRecoveryCodeExistConstraint } from '../../../libs/decorators/recovery-code.decorator';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { SharedModule } from '../../../libs/shared/shared.module';
import { UserQueryRepository } from '../users/db.providers/users/user.query-repository';
import { UserRepository } from '../users/db.providers/users/user.repository';
import { IsValidBirthdayFormatConstraint } from '../../../libs/decorators/birthday-format.decorator';
import { IsDifferentPasswordConstraint } from '../../../libs/decorators/different-password.decorator';
import { RecaptchaAdapter } from '../../../libs/adapters/recaptcha-adapter/recaptcha.adapter';
import { IsValidCaptchaConstraint } from '../../../libs/decorators/is-valid-captcha.decorator';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SetCookiesInterceptor } from '../../../libs/interceptos/set-cookies.interceptor';

@Module({
  imports: [UserModule, CqrsModule, SharedModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: SetCookiesInterceptor,
    },
    RecaptchaAdapter,
    IsValidCaptchaConstraint,
    IsConfirmationCodeExistConstraint,
    IsDifferentPasswordConstraint,
    IsEmailExistConstraint,
    IsEmailExistForRegistrationConstraint,
    IsEmailForPasswordRecoveryExistConstraint,
    IsRecoveryCodeExistConstraint,
    IsValidBirthdayFormatConstraint,
    IsUserNameExistConstraint,
    PrismaService,
    UserQueryRepository,
    UserRepository,
  ],
  exports: [],
})
export class AuthModule {}
