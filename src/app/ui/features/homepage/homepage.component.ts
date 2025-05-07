import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AnimatedBackgroundComponent } from './animated-background/animated-background.component';
import { Router } from '@angular/router';
import { NotLoggedModalComponent } from "../../../shared/notLoggedModal/notLoggedModal.component";

@Component({
  selector: 'app-homepage',
  imports: [ButtonComponent, AnimatedBackgroundComponent, NotLoggedModalComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class HomepageComponent {
  protected router = inject(Router);
  private isLoggedIn = false; // This wil be replaced with authentication service
  protected isNotLoggedModalOpen = false;

  private navigateToPlay() {
    this.router.navigate(['/play']);
  }

  protected checkIfLoggedIn() {
    if (this.isLoggedIn) {
      this.navigateToPlay();
    } else {
      this.isNotLoggedModalOpen = true;
    }
  }
}
