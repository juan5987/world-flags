import { ChangeDetectionStrategy, Component, EventEmitter, inject, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PlayService } from '../../../data/services/play.service';
import { Flag } from '../../../models/flag.model';

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
  #bestScore = signal(0);
  #timer = signal(59);
  #actualScore = signal(0);
  #flag = signal<Flag | null>(null);
  #answer = signal('');
  protected userInput = signal('');
  protected answerInput = new FormControl('');
  protected excludedCountries = signal<string[]>([]);
  protected form = new FormGroup({
    userInput: this.answerInput,
  });
  protected enterKey = new EventEmitter<KeyboardEvent>();

  #playService = inject(PlayService);

  constructor() {
    this.#playService.initializeGame();
  }

  protected get bestScore(): number {
    return this.#playService.bestScore;
  }

  protected get timer(): number {
    return this.#playService.timer;
  }

  protected get actualScore(): number {
    return this.#playService.actualScore;
  }

  protected get flag(): Flag | null {
    return this.#playService.currentFlag;
  }

  protected get answer(): string {
    return this.#playService.currentAnswer;
  }

}
