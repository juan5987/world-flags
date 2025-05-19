import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Flag } from '../../models/flag.model';
import { User } from '../../models/user.model';
import { FlagService } from '../api/flag.service';
import { FlagProxyService } from './flag-proxy.service';
import { GoogleAuthService } from './google-auth.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PlayService {
  #destroyRef = inject(DestroyRef);
  #flagService = inject(FlagService);
  #flagProxyService = inject(FlagProxyService);
  #googleAuthService = inject(GoogleAuthService);
  #authService = inject(AuthService);

  // Score related signals
  public readonly actualScore = signal(0);

  // Game state signals
  public readonly timer = signal(60);
  public readonly currentFlag = signal<Flag | null>(null);
  public readonly currentFlagWithUrlImageEncoded = signal<Flag>({} as Flag);
  public readonly currentAnswer = signal('');
  public readonly answerResult = signal<boolean | undefined>(undefined);
  public readonly excludedCountries = signal<string[]>([]);
  public readonly allFlags = signal<Flag[]>([]);
  public readonly currentLevel = signal(1);


  constructor() {}


  public getLastAnswer(): string | undefined {
    const countries = this.excludedCountries();
    return countries[countries.length - 2];
  }

  public checkAnswer(answer: string): boolean {
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
    this.actualScore.set(0);
    this.excludedCountries.set([]);
    this.timer.set(60);
  }

  public initializeGame(): void {
    this.#flagService
      .getFlagsByLevel(this.currentLevel())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (flags) => {
          this.allFlags.set(flags);
          if (flags.length) {
            this.selectNewRandomFlag();
          }
        },
        error: (error) => {
          console.error('Error fetching flags:', error);
        },
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
