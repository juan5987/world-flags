import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { LoadingGameComponent } from "./loading-game/loading-game.component";
import { AnimatedBackgroundComponent } from "../homepage/animated-background/animated-background.component";
import { QuizComponent } from "../quiz/quiz.component";

@Component({
  selector: 'app-play',
  imports: [LoadingGameComponent, AnimatedBackgroundComponent, QuizComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class PlayComponent { 
  protected loadingGame = signal(false);

  protected startGame() {
    this.loadingGame.set(true);
  }
}
