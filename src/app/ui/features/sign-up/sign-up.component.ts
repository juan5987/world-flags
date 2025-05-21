import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
@Component({
  selector: 'app-sign-up',
  imports: [RouterModule, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
})
export class SignUpComponent {
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
    'background-color': 'orange',
    color: 'var(--color-light)',
    'font-size': '1.25rem',
    width: '100%',
    'margin-bottom': '0',
    border: 'none',
    'border-radius': '.75rem',
  };
}
