import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ⚠ Déclaré AVANT @Get(':id') pour éviter que "top-10" soit capté comme :id.
  @Get('top-10')
  top10() {
    return this.usersService.top10();
  }

  // Handler racine pour GET /users?userId=<googleId> (lookup sans segment de chemin).
  // Doit précéder @Get(':id') pour ne pas être avalé par le paramètre.
  @Get()
  findByQuery(@Query('userId') userId?: string) {
    return this.usersService.findByQuery(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  update(@Param('userId') userId: string, @Body() dto: UpdateUserDto, @CurrentUser() user: User) {
    if (user.id !== userId) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    if (user.id !== id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    await this.usersService.remove(id);
  }
}