import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-animated-background',
  imports: [],
  templateUrl: './animated-background.component.html',
  styleUrl: './animated-background.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedBackgroundComponent {}
