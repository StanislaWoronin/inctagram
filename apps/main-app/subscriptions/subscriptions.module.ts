import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserQueryRepository } from '../users/db.providers/users/user.query-repository';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [SubscriptionsController],
  providers: [ConfigService, JwtService, PrismaService, UserQueryRepository],
  exports: [],
})
export class SubscriptionsModule {}
