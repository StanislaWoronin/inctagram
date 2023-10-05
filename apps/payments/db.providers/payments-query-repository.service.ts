import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../libs/providers/prisma/prisma.service';
import { Payments } from '@prisma/client';

@Injectable()
export class PaymentsQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomer(email: string): Promise<Payments> {
    const customer = await this.prisma.payments.findFirst({
      where: { email },
    });

    return customer;
  }
}
