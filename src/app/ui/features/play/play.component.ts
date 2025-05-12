import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { LoadingGameComponent } from "./loading-game/loading-game.component";

@Component({
  selector: 'app-play',
  imports: [LoadingGameComponent],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class PlayComponent { 
  protected loadingGame = signal(true);

  protected startGame() {
    this.loadingGame.set(true);
  }
}
