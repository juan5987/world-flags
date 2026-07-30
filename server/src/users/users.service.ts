import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { userId: id } });
  }

  findByQuery(userId?: string): Promise<User[]> {
    return this.prisma.user.findMany({
      where: userId ? { userId } : {},
    });
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({ data: dto });
  }

  async update(userId: string, dto: UpdateUserDto): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { userId } });
    if (!existing) {
      throw new NotFoundException(`User with userId "${userId}" not found`);
    }
    return this.prisma.user.update({ where: { userId }, data: dto });
  }

  async remove(id: string): Promise<void> {
    // Le front passe user.userId (identifiant logique) dans l'URL, pas la PK.
    const existing = await this.prisma.user.findUnique({ where: { userId: id } });
    if (!existing) {
      throw new NotFoundException(`User with userId "${id}" not found`);
    }
    await this.prisma.user.delete({ where: { userId: id } });
  }

  top10(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { bestScore: 'desc' },
      take: 10,
    });
  }
}