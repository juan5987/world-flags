import { Component, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AnimatedBackgroundComponent } from './animated-background/animated-background.component';

@Component({
  selector: 'app-homepage',
  imports: [ButtonComponent, AnimatedBackgroundComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class HomepageComponent {

}
