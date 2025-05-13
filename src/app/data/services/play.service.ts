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
                    const randomFlag = this.getRandomFlag(flags);
                    if (randomFlag) {
                        this.#currentFlag.set(randomFlag);
                        this.#currentAnswer.set(randomFlag.name);
                    } else {
                        console.error('Error loading flags');
                    }
                },
                error: (error) => {
                    console.error('Error loading flags:', error);
                }
            });
    }

    private removeExcludedCountries(flags: Flag[]): Flag[] {
        return flags.filter(flag => !this.#excludedCountries().includes(flag.name));
    }

    private getRandomFlag(flags: Flag[]): Flag | null {
        if (flags.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * flags.length);
        const randomFlag = flags[randomIndex];
        if (randomFlag) {
            this.#excludedCountries.update(excluded => [...excluded, randomFlag.name]);
        }
        return randomFlag;
    }
}
