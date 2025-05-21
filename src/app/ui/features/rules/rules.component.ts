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

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
