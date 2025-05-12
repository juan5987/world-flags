import { ChangeDetectionStrategy, Component, EventEmitter, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  protected answerResult: WritableSignal<boolean | undefined> = signal(undefined);
  protected bestScore = signal(0);
  protected timer = signal(59);
  protected actualScore = signal(0);
  protected flag = signal('');
  protected answer = signal('');
  protected userInput = signal('');
  protected answerInput = new FormControl('');
  protected excludedCountries = signal<string[]>([]);
  protected form = new FormGroup({
    userInput: this.answerInput,
  });
  protected enterKey = new EventEmitter<KeyboardEvent>();

  constructor() {
    this.getRandomFlag();
    this.form.valueChanges.subscribe((value) => {
      this.userInput.set(value.userInput || '');
    });
    this.enterKey.subscribe((event) => {
      if (event.key === 'Enter') {
        this.checkAnswer();
      }
    });
  }

  protected checkAnswer() {
    if (this.normalizeString(this.userInput()) === this.normalizeString(this.answer())) {
      this.answerResult.set(true);
      this.actualScore.set(this.actualScore() + 1);
      this.excludedCountries.set([...this.excludedCountries(), this.answer()]);
    } else {
      this.answerResult.set(false);
      if (this.actualScore() > 0) {
        this.actualScore.set(this.actualScore() - 1);
      }
    }
    this.resetAnswerResult();
    this.resetAnswerInput();
  }

  protected getRandomFlag() {
    // TODO: get random flag from api until it's not in the excludedCountries
    this.flag.set('https://flagcdn.com/us.svg');
    this.answer.set('états-unis');
  }

  protected getBestScore() {
    // TODO: get best score from api
  }

  protected getTimer() {
    // TODO: get timer from api
  }

  private resetAnswerResult() {
    setTimeout(() => {
      this.answerResult.set(undefined);
    }, 1000);
  }

  private resetAnswerInput() {
    this.answerInput.setValue('');
  }

  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }
}
