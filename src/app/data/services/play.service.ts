import { inject, Injectable, signal, WritableSignal, DestroyRef } from "@angular/core";
import { FlagService } from "../api/flag.service";
import { Flag } from "../../models/flag.model";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Injectable({
    providedIn: 'root'
})
export class PlayService {
    #destroyRef = inject(DestroyRef);
    #flagService = inject(FlagService);

    // Score related signals
    #bestScore = signal(0);
    #actualScore = signal(0);

    // Game state signals
    #timer = signal(59);
    #currentFlag = signal<Flag | null>(null);
    #currentAnswer = signal('');
    #userInput = signal('');
    #answerResult = signal<boolean | undefined>(undefined);
    #excludedCountries = signal<string[]>([]);
    #allFlags = signal<Flag[]>([]);

    constructor() {
        this.initializeGame();
    }

    get bestScore(): number {
        return this.#bestScore();
    }

    get timer(): number {
        return this.#timer();
    }

    get currentFlag(): Flag | null {
        return this.#currentFlag();
    }

    get actualScore(): number {
        return this.#actualScore();
    }

    get currentAnswer(): string {
        return this.#currentAnswer();
    }

    get userInput(): string {
        return this.#userInput();
    }

    get answerResult(): boolean | undefined {
        return this.#answerResult();
    }

    get excludedCountries(): string[] {
        return this.#excludedCountries();
    }

    private initializeGame(): void {
        this.#flagService.getAllFlags()
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
                }
            });
    }

    private removeExcludedCountries(flags: Flag[]): Flag[] {
        return flags.filter(flag => !this.#excludedCountries().includes(flag.name));
    }

    private selectNewRandomFlag(): void {
        const flags = this.#allFlags();
        const filteredFlags = this.removeExcludedCountries(flags);
        
        // if all flags have been used, reset the game
        if (filteredFlags.length === 0) {
            this.#excludedCountries.set([]);
            this.#actualScore.set(0);
            return this.selectNewRandomFlag();
        }

        const randomIndex = Math.floor(Math.random() * filteredFlags.length);
        const randomFlag = filteredFlags[randomIndex];
        
        this.#currentFlag.set(randomFlag);
        this.#currentAnswer.set(randomFlag.name);
        this.#excludedCountries.update(excluded => [...excluded, randomFlag.name]);
    }

    private normalizeString(str: string): string {
        return str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]/g, '');
      }
    

    public checkAnswer(answer: string): boolean {
        const isCorrect = answer.toLowerCase() === this.#currentAnswer().toLowerCase();
        this.#answerResult.set(isCorrect);
        
        if (isCorrect) {
            this.#actualScore.update(score => score + 1);
            this.selectNewRandomFlag();
        }
        
        return isCorrect;
    }

    public skipFlag(): void {
        this.selectNewRandomFlag();
    }
}
