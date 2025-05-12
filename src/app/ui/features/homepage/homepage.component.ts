import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AnimatedBackgroundComponent } from './animated-background/animated-background.component';
import { Router } from '@angular/router';
import { NotLoggedModalComponent } from '../../../shared/components/notLoggedModal/notLoggedModal.component';
import { NotLoggedModalService } from '../../../data/services/notLoggedModal.service';
import { UserService } from '../../../data/services/user.service';

@Component({
  selector: 'app-homepage',
  imports: [
    ButtonComponent,
    AnimatedBackgroundComponent,
    NotLoggedModalComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})

export class HomepageComponent {
  protected router = inject(Router);
  protected modalService = inject(NotLoggedModalService);
  protected userService = inject(UserService);

  protected get isLoggedIn(): boolean {
    return this.userService.isUserLoggedIn();
  }

  private navigateToPlay() {
    this.router.navigate(['/play']);
  }

  protected navigateToLogin() {
    this.router.navigate(['/login']);
  }

  protected logout() {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  protected checkIfLoggedIn() {
    if (this.isLoggedIn) {
      this.navigateToPlay();
    } else {
      this.modalService.openModal();
    }
  }
}
