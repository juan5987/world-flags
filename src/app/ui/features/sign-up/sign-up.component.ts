import {
  ChangeDetectionStrategy,
  Component,
  signal,
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
  encapsulation: ViewEncapsulation.None,
})
export class SignUpComponent {
  protected showPassword = signal(false);
  protected showConfirmPassword = signal(false);

  protected togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  protected toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }
}
