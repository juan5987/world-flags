import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { PlayService } from '../../../data/services/play.service';
import { Flag } from '../../../models/flag.model';

type QuizForm = FormGroup<{
  userInput: FormControl<string>;
}>;

@Component({
  selector: 'app-quiz',
  imports: [ReactiveFormsModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class QuizComponent {
  protected readonly bestScore = computed(() => this.#playService.bestScore);
  protected readonly timer = computed(() => this.#playService.timer);
  protected readonly actualScore = computed(
    () => this.#playService.actualScore
  );
  protected readonly flag = computed(() => this.#playService.currentFlag);
  protected readonly answerResult = computed(
    () => this.#playService.answerResult
  );

  readonly #playService = inject(PlayService);
  readonly #fb = inject(NonNullableFormBuilder);
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
      }
    }
  }
}
