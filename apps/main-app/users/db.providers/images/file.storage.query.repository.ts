import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { Photos, Prisma } from '@prisma/client';
import { PhotoType } from '../../../../../libs/shared/enums/photo-type.enum';

@Injectable()
export class FileStorageQueryRepository {
  constructor(private prisma: PrismaService) {}
}
