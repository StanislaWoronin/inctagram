import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TestingController } from './testing/testing.controller';
import { SharedModule } from '../../libs/shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { TestingRepository } from './testing/testing.repository';
import { PrismaService } from '../../libs/providers/prisma/prisma.service';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../libs/shared/enums/microservices-name.enum';
import { UserModule } from './users/user.module';
import { JwtService } from '@nestjs/jwt';
import { LoggerMiddleware } from '../../libs/midleware/logger.midleware';
import { MainAppConfig } from './config/main-app.config';
import { TestingService } from './testing/testing.service';
import { TaskService } from '../../libs/task-scheduling/task.service';
import { TaskRepository } from '../../libs/task-scheduling/task.repository';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [
    SharedModule,
    AuthModule,
    ClientsModule.register([getProviderOptions(Microservices.FileStorage)]),
    UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    SubscriptionsModule,
  ],
  controllers: [TestingController],
  providers: [
    TaskService,
    TaskRepository,
    TestingService,
    TestingRepository,
    PrismaService,
    JwtService,
    MainAppConfig,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
