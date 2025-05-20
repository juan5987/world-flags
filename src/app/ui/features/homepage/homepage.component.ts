import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../data/services/auth.service';
import { GoogleAuthService } from '../../../data/services/google-auth.service';
import { NotLoggedModalService } from '../../../data/services/notLoggedModal.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NotLoggedModalComponent } from '../../../shared/components/notLoggedModal/notLoggedModal.component';

@Component({
  selector: 'app-homepage',
  imports: [
    ButtonComponent,
    NotLoggedModalComponent,
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
  protected username = this.authService.user()?.username || '';
  protected bestScore = this.authService.user()?.bestScore || 0;

  protected connectionButtonStyles = {
    'background-color': 'var(--primary-color)',
    color: 'var(--color-light)',
  };

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

  protected logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  protected checkIfLoggedIn() {
    if (this.isLoggedIn) {
      this.router.navigate(['/play']);
    } else {
      this.modalService.openModal();
    }
  }

  protected createUser() {
    this.authService.createUser(this.usernameForm.controls?.username?.value);
  }
}
