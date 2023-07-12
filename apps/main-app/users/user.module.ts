import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import {
  USER_COMMANDS_HANDLERS,
  USER_QUERIES_HANDLERS,
  UserFacade,
} from './application-services';
import { userFacadeFactory } from './application-services/user-facade.factory';
import { UserRepository } from './db.providers/user.repository';
import { UserQueryRepository } from './db.providers/user-query.repository';
import { JwtService } from '@nestjs/jwt';
import {
  EmailAdapters,
  EmailManager,
} from '../../../libs/adapters/email.adapter';
import { IsConfirmationCodeExistConstraint } from '../auth/decorators/confirmation-code.decorator';
import { IsUserNameExistConstraint } from '../auth/decorators/user-name.decorator';
import { TokensFactory } from '../../../libs/shared/tokens.factory';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { UserController } from './user.controller';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../../libs/shared/enums/microservices-name.enum';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([getProviderOptions(Microservices.FileStorage)]),
  ],
  controllers: [UserController],
  providers: [
    ...USER_COMMANDS_HANDLERS,
    ...USER_QUERIES_HANDLERS,
    {
      provide: UserFacade,
      inject: [CommandBus, QueryBus],
      useFactory: userFacadeFactory,
    },
    TokensFactory,
    UserRepository,
    UserQueryRepository,
    JwtService,
    EmailAdapters,
    EmailManager,
    IsConfirmationCodeExistConstraint,
    IsUserNameExistConstraint,
    PrismaService,
    UserController,
  ],
  exports: [UserFacade, UserModule],
})
export class UserModule implements OnModuleInit {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  onModuleInit(): any {
    this.commandBus.register(USER_COMMANDS_HANDLERS);
    this.queryBus.register(USER_QUERIES_HANDLERS);
  }
}