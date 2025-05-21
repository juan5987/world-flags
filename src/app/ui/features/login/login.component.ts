import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleAuthService } from '../../../data/services/google-auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, ButtonComponent, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class LoginComponent {
  private authService = inject(GoogleAuthService);

  protected connectionButtonStyles = {
    'background-color': 'var(--color-dark)',
    color: 'var(--color-light)',
    'font-size': '1.25rem',
    width: '140px',
    'margin-bottom': '0',
    border: 'none',
    'border-radius': '.75rem',
  };

  protected cancelButtonStyles = {
    'background-color': 'var(--primary-color)',
    color: 'var(--color-light)',
    'font-size': '1.25rem',
    width: '140px',
    'margin-bottom': '0',
    'border-radius': '.75rem',
  };

  protected signInWithGoogle() {
    this.authService.login();
  }
}