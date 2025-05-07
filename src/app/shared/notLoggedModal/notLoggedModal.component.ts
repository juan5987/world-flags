import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../components/button/button.component';

@Component({
  selector: 'app-not-logged-modal',
  imports: [ButtonComponent],
  templateUrl: './notLoggedModal.component.html',
  styleUrl: './notLoggedModal.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotLoggedModalComponent {
  protected router = inject(Router);

  protected closeModal() {}

  protected navigateToPlay() {
    this.router.navigate(['/play']);
  }

  protected navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
