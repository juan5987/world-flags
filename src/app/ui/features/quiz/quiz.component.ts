import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayService } from '../../../data/services/play.service';
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-quiz',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class QuizComponent {
  @HostListener('window:blur', [])
  onWindowBlur() {
    this.#playService.selectNewRandomFlag();
  }

  protected readonly bestScore = computed(() => this.#playService.bestScore);
  protected readonly timer = computed(() => this.#playService.timer);
  protected readonly actualScore = computed(
    () => this.#playService.actualScore
  );
  protected readonly flag = computed(() => this.#playService.currentFlag);
  protected readonly answerResult = computed(
    () => this.#playService.answerResult
  );
  protected readonly lastAnswer = computed(
    () =>
      this.#playService.excludedCountries[
        this.#playService.excludedCountries.length - 2
      ]
  );
  protected showResult = signal(false);
  protected isSkipDisabled = signal(false);
  readonly #playService = inject(PlayService);
  readonly #fb = inject(NonNullableFormBuilder);
  readonly form = this.#fb.group({
    userInput: this.#fb.control(''),
  });
  readonly #router = inject(Router);

  constructor() {
    this.#playService.initializeGame();
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      const currentInput = this.form.controls?.userInput?.value;
      if (currentInput) {
        this.#playService.checkAnswer(currentInput);
        this.form.reset();
        this.showAnswerResult();
      }
    }
  }

  protected quitGame(): void {
    this.#playService.resetGame();
    this.#router.navigate(['/']);
  }

  protected skipFlag(): void {
    if (!this.isSkipDisabled()) {
      this.isSkipDisabled.set(true);
      this.#playService.skipFlag();
      this.form.reset();
      this.showAnswerResult();
      
      // Réactiver le bouton après 2 secondes
      setTimeout(() => {
        this.isSkipDisabled.set(false);
      }, 1000);
    }
  }

  private showAnswerResult(): void {
    this.showResult.set(true);
    setTimeout(() => {
      this.showResult.set(false);
    }, 1000);
  }
}
