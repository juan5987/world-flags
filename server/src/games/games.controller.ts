import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EndGameDto } from './dto/end-game.dto';
import { GamesService } from './games.service';

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@CurrentUser() user: User) {
    return this.gamesService.createGame(user.id);
  }

  @Post(':id/end')
  end(@Param('id') id: string, @Body() dto: EndGameDto, @CurrentUser() user: User) {
    return this.gamesService.endGame(id, dto.score, user.id);
  }
}
