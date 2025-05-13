import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { GoogleAuthService } from '../../../data/services/google-auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnimatedBackgroundComponent } from "../homepage/animated-background/animated-background.component";

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, AnimatedBackgroundComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class LoginComponent {
  private authService = inject(GoogleAuthService);

  protected signInWithGoogle() {
    this.authService.login();
  }
}
