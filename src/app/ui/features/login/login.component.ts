import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { GoogleAuthService } from '../../../data/services/google-auth.service';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimatedBackgroundComponent } from "../homepage/animated-background/animated-background.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";


@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, AnimatedBackgroundComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class LoginComponent {
  private authService = inject(GoogleAuthService);
  protected shouldDisplayUsernameModal = this.authService.showUsernameModal();
  readonly #usernameForm = inject(NonNullableFormBuilder);
  protected usernameForm = this.#usernameForm.group({
    username: this.#usernameForm.control('', [Validators.required]),
  });

  protected signInWithGoogle() {
    this.authService.login();
  }

  protected createUser() {
    this.authService.createUser(this.usernameForm.controls?.username?.value);
  }
}
