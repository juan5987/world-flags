import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import flags from "../../../../data/countries_flags.json";

@Component({
  selector: 'app-bubbles-background',
  imports: [],
  templateUrl: './bubbles-background.component.html',
  styleUrl: './bubbles-background.component.scss',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BubblesBackgroundComponent {
  flags: any = flags;
}
