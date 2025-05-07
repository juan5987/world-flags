import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AnimatedBackgroundComponent } from './animated-background/animated-background.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [ButtonComponent, AnimatedBackgroundComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class HomepageComponent {
  protected router = inject(Router);
  protected launchGame() {}
}
