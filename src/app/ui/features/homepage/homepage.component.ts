import { Component, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { BubblesBackgroundComponent } from './bubbles-background/bubbles-background.component';

@Component({
  selector: 'app-homepage',
  imports: [ButtonComponent, BubblesBackgroundComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class HomepageComponent {

}
