import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import validate from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { FlagsModule } from './flags/flags.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PrismaModule,
    FlagsModule,
    UsersModule,
    AuthModule,
    GamesModule,
  ],
})
export class AppModule {}