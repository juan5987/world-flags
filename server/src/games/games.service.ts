import { Injectable, NotFoundException } from '@nestjs/common';
import { GameStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  DURATION_MS,
  EARLY_SKEW_MS,
  LATE_GRACE_MS,
} from './game.constants';

export interface CreatedGame {
  id: string;
  startedAt: Date;
  durationMs: number;
}

export interface EndGameResult {
  status: 'ENDED';
  scoreAccepted: boolean;
  bestScore: number;
}

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async createGame(userId: string, durationMs = DURATION_MS): Promise<CreatedGame> {
    const game = await this.prisma.game.create({
      data: { userId, durationMs },
    });
    return {
      id: game.id,
      startedAt: game.startedAt,
      durationMs: game.durationMs,
    };
  }

  async endGame(gameId: string, score: number, userId: string): Promise<EndGameResult> {
    const game = await this.prisma.game.findFirst({
      where: { id: gameId, userId },
    });
    if (!game) {
      throw new NotFoundException(`Game with id "${gameId}" not found`);
    }

    if (game.status === GameStatus.ENDED) {
      throw new NotFoundException(`Game with id "${gameId}" is already ended`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User for game "${gameId}" not found`);
    }

    // Fenêtre de temps autoritaire : seule la durée est validée, pas le contenu
    // du score (limite assumée — cf. ADR-0001).
    const elapsedMs = Date.now() - game.startedAt.getTime();
    const withinWindow =
      elapsedMs >= game.durationMs - EARLY_SKEW_MS &&
      elapsedMs <= game.durationMs + LATE_GRACE_MS;

    await this.prisma.game.update({
      where: { id: gameId },
      data: {
        score,
        endedAt: new Date(),
        status: GameStatus.ENDED,
        suspicious: !withinWindow,
      },
    });

    let bestScore = user.bestScore;
    if (withinWindow && score > user.bestScore) {
      const updated = await this.prisma.user.update({
        where: { id: user.id },
        data: { bestScore: score, bestScoreDate: new Date() },
      });
      bestScore = updated.bestScore;
    }

    return {
      status: 'ENDED',
      scoreAccepted: withinWindow,
      bestScore,
    };
  }
}
