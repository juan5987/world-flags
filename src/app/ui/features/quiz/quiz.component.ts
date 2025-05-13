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

}
