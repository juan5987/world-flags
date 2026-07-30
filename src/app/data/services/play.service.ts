import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Flag } from '../../models/flag.model';
import { ActiveGame } from '../../models/game.model';
import { FlagService } from '../api/flag.service';
import { GamesGateway } from '../gateways/games.gateway';
import { FlagProxyService } from './flag-proxy.service';
import { GoogleAuthService } from './google-auth.service';

const TICK_INTERVAL_MS = 250;

@Injectable({
  providedIn: 'root',
})
export class PlayService {
  #destroyRef = inject(DestroyRef);
  #flagService = inject(FlagService);
  #flagProxyService = inject(FlagProxyService);
  #googleAuthService = inject(GoogleAuthService);
  #gamesGateway = inject(GamesGateway);

  // Score related signals
  public readonly actualScore = signal(0);

  // Game state signals
  public readonly isGameOver = signal(false);
  public readonly scoreAccepted = signal<boolean | null>(null);
  public readonly currentFlag = signal<Flag | null>(null);
  public readonly currentFlagWithUrlImageEncoded = signal<Flag>({} as Flag);
  public readonly currentAnswer = signal('');
  public readonly answerResult = signal<boolean | undefined>(undefined);
  public readonly excludedCountries = signal<string[]>([]);
  public readonly allFlags = signal<Flag[]>([]);
  public readonly currentLevel = signal(1);

  // Timer autoritatif serveur : la partie est ancrée sur l'horloge monotone
  // (performance.now()) à la réception de POST /games. Le décompte est purement
  // dérivé (computed) ; l'intervalle ne fait que rafraîchir le tick.
  readonly #activeGame = signal<ActiveGame | null>(null);
  readonly #nowTick = signal(0);

  public readonly timer = computed(() => {
    const game = this.#activeGame();
    if (!game) return 0;
    const remainingMs = game.durationMs - (this.#nowTick() - game.anchorPerfMs);
    return Math.max(0, Math.ceil(remainingMs / 1000));
  });

  #timerInterval: ReturnType<typeof setInterval> | null = null;
  #ending = false;

  constructor() {
    // Déclenche la fin quand le décompte atteint 0 (garde d'idempotence via #ending).
    effect(() => {
      if (this.#activeGame() && this.timer() === 0) {
        this.endGame();
      }
    });

    // Nettoie l'intervalle à la destruction du service
    this.#destroyRef.onDestroy(() => this.stopTimer());
  }


  public getLastAnswer(): string | undefined {
    const countries = this.excludedCountries();
    return countries[countries.length - 2];
  }

  public checkAnswer(answer: string): boolean {
    if (this.isGameOver()) return false;

    const isCorrect = this.isAnswerCorrect(answer);

    this.answerResult.set(isCorrect);
    this.updateScore(isCorrect);
    this.selectNewRandomFlag();

    return isCorrect;
  }

  public selectNewRandomFlag(): void {
    const filteredFlags = this.removeExcludedCountries(this.allFlags());

    if (!filteredFlags.length) {
      this.excludedCountries.set([]);
      return this.selectNewRandomFlag();
    }

    const randomFlag = this.getRandomFlagFromList(filteredFlags);
    this.updateGameStateWithNewFlag(randomFlag);
    this.loadFlagImage(randomFlag);
  }

  public resetGame(): void {
    this.stopTimer();
    this.#activeGame.set(null);
    this.#ending = false;
    this.actualScore.set(0);
    this.excludedCountries.set([]);
    this.scoreAccepted.set(null);
    this.isGameOver.set(false);
  }

  public initializeGame(): void {
    this.resetGame();
    this.#flagService
      .getFlagsByLevel(this.currentLevel())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (flags) => {
          this.allFlags.set(flags);
          if (flags.length) {
            this.selectNewRandomFlag();
            this.startGame();
          }
        },
        error: (error) => {
          console.error('Error fetching flags:', error);
        },
      });
  }

  public stopTimer(): void {
    if (this.#timerInterval !== null) {
      clearInterval(this.#timerInterval);
      this.#timerInterval = null;
    }
  }

  private startGame(): void {
    this.#gamesGateway
      .createGame()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: ({ id, durationMs }) => {
          this.#activeGame.set({
            id,
            durationMs,
            anchorPerfMs: performance.now(),
          });
          this.startTicking();
        },
        error: (error) => {
          console.error('PlayService - Could not create game:', error);
        },
      });
  }

  private startTicking(): void {
    this.stopTimer();
    this.#nowTick.set(performance.now());
    this.#timerInterval = setInterval(() => {
      this.#nowTick.set(performance.now());
    }, TICK_INTERVAL_MS);
  }

  private endGame(): void {
    if (this.#ending) return;
    this.#ending = true;

    this.stopTimer();
    this.isGameOver.set(true);

    const game = this.#activeGame();
    if (!game) return;

    this.#gamesGateway
      .endGame(game.id, this.actualScore())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (result) => {
          this.scoreAccepted.set(result.scoreAccepted);
          this.applyServerBestScore(result.bestScore);
        },
        error: (error) => {
          console.error('PlayService - Could not end game:', error);
        },
      });
  }

  private applyServerBestScore(bestScore: number): void {
    const user = this.#googleAuthService.user();
    if (!user || user.bestScore === bestScore) return;
    this.#googleAuthService.user.set({
      ...user,
      bestScore,
      bestScoreDate: new Date(),
    });
  }

  private updateGameStateWithNewFlag(flag: Flag): void {
    this.currentFlag.set(flag);
    this.currentAnswer.set(flag.name_fr);
    this.excludedCountries.update((excluded) => [...excluded, flag.name_fr]);
  }

  private removeExcludedCountries(flags: Flag[]): Flag[] {
    return flags.filter(
      (flag) => !this.excludedCountries().includes(flag.name_fr)
    );
  }

  private isAnswerCorrect(answer: string): boolean {
    return (
      this.normalizeString(answer) ===
      this.normalizeString(this.currentAnswer())
    );
  }

  private updateScore(isCorrect: boolean): void {
    if (isCorrect) {
      this.actualScore.update((score) => score + 3);
    } else if (this.actualScore() > 0) {
      this.actualScore.update((score) => score - 1);
    }
  }

  private getRandomFlagFromList(flags: Flag[]): Flag {
    const randomIndex = Math.floor(Math.random() * flags.length);
    return flags[randomIndex];
  }

  /**
   * Loads the flag image through a proxy for security reasons.
   * The proxy is used to prevent the image URL from being exposed in the DOM,
   * as the image filename contains the country code.
   * This prevents users from cheating by inspecting the source code.
   */
  private loadFlagImage(flag: Flag): void {
    this.#flagProxyService
      .getFlagAsBase64(flag.flag)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (base64Image) => {
          this.currentFlagWithUrlImageEncoded.set({
            ...flag,
            flag: base64Image,
          });
        },
        error: (error) => {
          console.error('Error loading flag image:', error);
        },
      });
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]/g, '') // remove special characters
      .trim();
  }
}
