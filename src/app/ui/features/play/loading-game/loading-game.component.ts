import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-loading-game',
  imports: [],
  templateUrl: './loading-game.component.html',
  styleUrl: './loading-game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class LoadingGameComponent {}
