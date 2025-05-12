import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AnimatedBackgroundComponent } from "../../homepage/animated-background/animated-background.component";

@Component({
  selector: 'app-loading-game',
  imports: [AnimatedBackgroundComponent],
  templateUrl: './loading-game.component.html',
  styleUrl: './loading-game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class LoadingGameComponent { }
