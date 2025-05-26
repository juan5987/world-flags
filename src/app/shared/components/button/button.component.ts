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
        return 'form form-cancel';
      case 'form-validate':
        return 'form form-validate';
      case 'main-menu':
        return 'main-menu';
      case 'main-menu-login':
        return 'main-menu main-menu-login';
      case 'form-light':
        return 'form form-light';
    }
  }
}
