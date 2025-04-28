import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import flags from "../../../../data/countries_flags.json";

@Component({
  selector: 'app-bubbles-background',
  imports: [],
  templateUrl: './animated-background.component.html',
  styleUrl: './animated-background.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AnimatedBackgroundComponent {
  flags: any = flags;
}
