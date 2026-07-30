import { Injectable } from '@nestjs/common';
import { Flag, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlagsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(level?: number): Promise<Flag[]> {
    const where: Prisma.FlagWhereInput = level ? { level } : {};
    return this.prisma.flag.findMany({ where });
  }
}