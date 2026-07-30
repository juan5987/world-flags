import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
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
  imports: [NgClass, RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  routerLink = input('');
  buttonText = input('valider');
  buttonStyle = input<ButtonStyles>('form-validate');

  buttonStyles = computed(() => {
    switch (this.buttonStyle()) {
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
  });
}