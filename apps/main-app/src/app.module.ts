import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { SharedModule } from '../../../libs/shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { TestingRepository } from './testing.repository';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { ClientsModule } from '@nestjs/microservices';
import { getProviderOptions } from '../../../libs/providers/rabbit-mq/providers.option';
import { Microservices } from '../../../libs/shared/enums/microservices-name.enum';
import { UserModule } from '../users/user.module';
import { JwtService } from '@nestjs/jwt';

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
  ],
  controllers: [AppController],
  providers: [TestingRepository, PrismaService, JwtService],
})
export class AppModule {}
