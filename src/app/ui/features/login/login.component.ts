import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleAuthService } from '../../../data/services/google-auth.service';
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, ButtonComponent],
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
