import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rules',
  imports: [ButtonComponent],
  templateUrl: './rules.component.html',
  styleUrl: './rules.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class RulesComponent {
  protected router = inject(Router);

  protected backButtonStyles = {
    'background-color': 'var(--primary-color)',
    color: 'var(--color-light)',
    'font-size': '1.25rem',
    width: '100%',
    'border-radius': '0.5rem',
    ':hover': {
      'background-color': 'var(--primary-color-dark)',
      transform: 'scale(1.02)',
      transition: 'all 0.2s ease-in-out',
    },
  };

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
