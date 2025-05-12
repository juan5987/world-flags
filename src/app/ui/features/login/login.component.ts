import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { GoogleAuthService } from '../../../data/services/google-auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class LoginComponent { 
  private authService = inject(GoogleAuthService);

  signInWithGoogle() {
    this.authService.login();
  }
}
