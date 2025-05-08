import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { NotLoggedModalService } from '../../../data/services/notLoggedModal.service';

@Component({
  selector: 'app-not-logged-modal',
  imports: [ButtonComponent],
  templateUrl: './notLoggedModal.component.html',
  styleUrl: './notLoggedModal.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'closeModal()',
  },
  
})
export class NotLoggedModalComponent {
  protected router = inject(Router);
  protected modalService = inject(NotLoggedModalService);

  protected closeModal() {
    this.modalService.closeModal()
  }

  protected navigateToPlay() {
    this.modalService.closeModal()
    this.router.navigate(['/play']);
  }

  protected navigateToLogin() {
    this.modalService.closeModal()
    this.router.navigate(['/login']);
  }
}
