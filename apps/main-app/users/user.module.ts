import { Module, OnModuleInit } from '@nestjs/common';
import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import {
  USER_COMMANDS_HANDLERS,
  USER_QUERIES_HANDLERS,
  UserFacade,
} from './application-services';
import { userFacadeFactory } from './application-services/user-facade.factory';
import { UserRepository } from './db.providers/users/user.repository';
import { UserQueryRepository } from './db.providers/users/user.query-repository';
import { JwtService } from '@nestjs/jwt';
import {
  EmailAdapters,
  EmailManager,
} from '../../../libs/adapters/email.adapter';
import { IsConfirmationCodeExistConstraint } from '../../../libs/decorators/confirmation-code.decorator';
import { IsUserNameExistConstraint } from '../../../libs/decorators/user-name-exists.decorator';
import { TokensFactory } from '../../../libs/shared/tokens.factory';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { UserController } from './user.controller';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../../libs/shared/enums/microservices-name.enum';
import { AvatarRepository } from './db.providers/images/avatar.repository';
import { GitHubAdapter } from '../../../libs/adapters/third-party-services-adapter/git-hub.adapter';
import { GoogleAdapter } from '../../../libs/adapters/third-party-services-adapter/google.adapter';
import { OAuthService } from '../../../libs/adapters/third-party-services-adapter/oauth.service';
import { PostQueryRepository } from './db.providers/images/post.query-repository';
import { PostRepository } from './db.providers/images/post.repository';
import { ProfileQueryRepository } from './db.providers/profile/profile.query-repository';
import { ProfileRepository } from './db.providers/profile/profile.repository';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      getProviderOptions(Microservices.FileStorage),
      getProviderOptions(Microservices.Payments),
    ]),
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
    GitHubAdapter,
    GoogleAdapter,
    EmailAdapters,
    EmailManager,
    JwtService,
    OAuthService,
    PrismaService,
    AvatarRepository,
    PostRepository,
    PostQueryRepository,
    ProfileRepository,
    ProfileQueryRepository,
    UserRepository,
    UserQueryRepository,
    IsConfirmationCodeExistConstraint,
    IsUserNameExistConstraint,
    TokensFactory,
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
