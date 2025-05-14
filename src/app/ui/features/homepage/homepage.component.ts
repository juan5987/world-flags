import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AnimatedBackgroundComponent } from './animated-background/animated-background.component';
import { Router } from '@angular/router';
import { NotLoggedModalComponent } from '../../../shared/components/notLoggedModal/notLoggedModal.component';
import { NotLoggedModalService } from '../../../data/services/notLoggedModal.service';
import { AuthService } from '../../../data/services/auth.service';
import { GoogleAuthService } from '../../../data/services/google-auth.service';
import {
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-homepage',
  imports: [
    ButtonComponent,
    AnimatedBackgroundComponent,
    NotLoggedModalComponent,
    ReactiveFormsModule,
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
  protected userService = inject(AuthService);
  protected authService = inject(GoogleAuthService);
  protected username = computed(() => this.authService.username());
  protected bestScore = computed(() => this.authService.bestScore());

  protected readonly shouldDisplayUsernameModal = computed(() => {
    return this.authService.showUsernameModal();
  });

  protected get isLoggedIn(): boolean {
    return this.userService.isUserLoggedIn();
  }
  readonly #usernameForm = inject(NonNullableFormBuilder);
  protected usernameForm = this.#usernameForm.group({
    username: this.#usernameForm.control('', [Validators.required]),
  });

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

  protected createUser() {
    this.authService.createUser(this.usernameForm.controls?.username?.value);
  }
}
