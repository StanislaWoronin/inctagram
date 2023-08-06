import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';

@Injectable()
export class SubscriptionQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomer(email: string): Promise<any> {}
}
