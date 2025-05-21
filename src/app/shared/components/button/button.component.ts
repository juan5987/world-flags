import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';

type ButtonStyles =
  | 'form-cancel'
  | 'form-validate'
  | 'main-menu'
  | 'main-menu-login'
  | 'form-light';

@Component({
  selector: 'app-button',
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  @Input() routerLink: string = '';
  @Input() buttonText: string = 'valider';
  @Input() buttonStyle: ButtonStyles = 'form-validate';

  get buttonStyles() {
    switch (this.buttonStyle) {
      case 'form-cancel':
        return this.formCancelStyle;
      case 'form-validate':
        return this.formValidateStyle;
      case 'main-menu':
        return this.mainMenuStyle;
      case 'main-menu-login':
        return this.mainMenuLoginStyle;
      case 'form-light':
        return this.formLightStyle;
    }
  }

  private formButtonStyle = {
    width: '140px',
    'margin-bottom': '0',
    'border-radius': '.75rem',
    'font-size': '1.25rem',
    color: 'var(--color-light)',
  };

  protected formCancelStyle = {
    ...this.formButtonStyle,
    'background-color': 'orange',
  };

  protected formValidateStyle = {
    ...this.formButtonStyle,
    'background-color': 'var(--color-dark)',
  };

  protected formLightStyle = {
    ...this.formButtonStyle,
    'background-color': 'var(--color-light)',
    color: 'var(--color-dark)',
  };

  protected mainMenuStyle = {
    'background-color': 'var(--color-light)',
    color: 'var(--color-dark)',
    'font-size': '1.5rem',
    width: '200px',
    'margin-bottom': '1rem',
    'border-radius': '.5em',
  };

  protected mainMenuLoginStyle = {
    ...this.mainMenuStyle,
    'background-color': 'var(--primary-color)',
    color: 'var(--color-light)',
  };
}
