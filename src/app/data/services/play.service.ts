import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Flag } from '../../models/flag.model';
import { FlagService } from '../api/flag.service';
import { FlagProxyService } from './flag-proxy.service';

@Injectable({
  providedIn: 'root',
})
export class PlayService {
  #destroyRef = inject(DestroyRef);
  #flagService = inject(FlagService);
  #flagProxyService = inject(FlagProxyService);

  // Score related signals
  #bestScore = signal(0);
  #actualScore = signal(0);

  // Game state signals
  #timer = signal(60);
  #currentFlag = signal<Flag | null>(null);
  #currentFlagImage = signal<string>('');
  #currentAnswer = signal('');
  #answerResult = signal<boolean | undefined>(undefined);
  #excludedCountries = signal<string[]>([]);
  #allFlags = signal<Flag[]>([]);
  #currentLevel = signal(1);

  constructor() {}

  get bestScore(): number {
    return this.#bestScore();
  }

  get actualScore(): number {
    return this.#actualScore();
  }

  get timer(): number {
    return this.#timer();
  }

  get currentFlag(): { flag: string } | null {
    return this.#currentFlag() ? { flag: this.#currentFlagImage() } : null;
  }

  get currentAnswer(): string {
    return this.#currentAnswer();
  }

  get answerResult(): boolean | undefined {
    return this.#answerResult();
  }

  get excludedCountries(): string[] {
    return this.#excludedCountries();
  }

  public checkAnswer(answer: string): boolean {
    const isCorrect =
      this.normalizeString(answer) ===
      this.normalizeString(this.#currentAnswer());
    this.#answerResult.set(isCorrect);

    if (isCorrect) {
      this.#actualScore.update((score) => score + 3);
    } else {
      if (this.#actualScore() > 0) {
        this.#actualScore.update((score) => score - 1);
      }
    }
    this.selectNewRandomFlag();
    return isCorrect;
  }

  public selectNewRandomFlag(): void {
    const flags = this.#allFlags();
    const filteredFlags = this.removeExcludedCountries(flags);

    // if all flags have been used, reset the game
    if (filteredFlags.length === 0) {
      this.#excludedCountries.set([]);
      return this.selectNewRandomFlag();
    }

    const randomIndex = Math.floor(Math.random() * filteredFlags.length);
    const randomFlag = filteredFlags[randomIndex];

    this.#currentFlag.set(randomFlag);
    this.#currentAnswer.set(randomFlag.name_fr);
    this.#excludedCountries.update((excluded) => [
      ...excluded,
      randomFlag.name_fr,
    ]);

    // Load the flag image through the proxy
    this.#flagProxyService
      .getFlagAsBase64(randomFlag.flag)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (base64Image) => {
          this.#currentFlagImage.set(base64Image);
        },
        error: (error) => {
          console.error('Error loading flag image:', error);
        },
      });
  }

  public skipFlag(): void {
    this.selectNewRandomFlag();
    if (this.#actualScore() > 0) {
      this.#actualScore.update((score) => score - 1);
    }  

    this.#answerResult.set(false);
  }

  public resetGame(): void {
    this.#actualScore.set(0);
    this.#excludedCountries.set([]);
    this.#timer.set(60);
  }

  public initializeGame(): void {
    this.#flagService
      .getFlagsByLevel(this.#currentLevel())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (flags) => {
          this.#allFlags.set(flags);
          if (flags.length) {
            this.selectNewRandomFlag();
          }
        },
        error: (error) => {
          console.error('Error fetching flags:', error);
        },
      });
  }

  private removeExcludedCountries(flags: Flag[]): Flag[] {
    return flags.filter(
      (flag) => !this.#excludedCountries().includes(flag.name_fr)
    );
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
