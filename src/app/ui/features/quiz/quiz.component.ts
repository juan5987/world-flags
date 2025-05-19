import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
  computed
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayService } from '../../../data/services/play.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { GoogleAuthService } from '../../../data/services/google-auth.service';

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

  readonly #playService = inject(PlayService);
  readonly #authService = inject(GoogleAuthService);
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #router = inject(Router);

  protected readonly bestScore = computed(() => this.#authService.user()?.bestScore || 0);
  protected readonly timer = this.#playService.timer;
  protected readonly actualScore = this.#playService.actualScore;
  protected readonly flag = this.#playService.currentFlagWithUrlImageEncoded;
  protected readonly answerResult = this.#playService.answerResult;
  protected showResult = signal(false);
  protected isSkipDisabled = signal(false);

  readonly form = this.#fb.group({
    userInput: this.#fb.control(''),
  });

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
      this.#playService.checkAnswer('');
      this.form.reset();
      this.showAnswerResult();

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

  protected getLastAnswer(): string | undefined {
    return this.#playService.getLastAnswer();
  }
}
