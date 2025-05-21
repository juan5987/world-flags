import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-forgot-password',
  imports: [ButtonComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent { 
  protected connectionButtonStyles = {
    'background-color': 'var(--color-dark)',
    color: 'var(--color-light)',
    'font-size': '1.25rem',
    width: '100%',
    'margin-bottom': '0',
    border: 'none',
    'border-radius': '.75rem',
  };

  protected cancelButtonStyles = {
    'background-color': 'var(--primary-color)',
    color: 'var(--color-light)',
    'font-size': '1.25rem',
    width: '100%',
    'margin-bottom': '0',
    border: 'none',
    'border-radius': '.75rem',
  };

  protected forgotPassword(event: Event) {
    event.preventDefault();
  }
}
