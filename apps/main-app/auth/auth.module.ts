import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { IsConfirmationCodeExistConstraint } from './decorators/confirmation-code.decorator';
import { IsUserNameExistConstraint } from './decorators/user-name.decorator';
import {
  IsEmailExistConstraint,
  IsEmailExistForRegistrationConstraint,
  IsEmailForPasswordRecoveryExistConstraint,
} from './decorators/email.decorator';
import { IsRecoveryCodeExistConstraint } from './decorators/recovery-code.decorator';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { SharedModule } from '../../../libs/shared/shared.module';
import { UserQueryRepository } from '../users/db.providers/user-query.repository';
import { UserRepository } from '../users/db.providers/user.repository';
import { IsValidBirthdayFormatConstraint } from './decorators/birthday-format.decorator';
import { IsDifferentPasswordConstraint } from './decorators/different-password.decorator';

@Module({
  imports: [UserModule, CqrsModule, SharedModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
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
