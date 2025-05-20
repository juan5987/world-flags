import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
  @Input() isDisabled: boolean = false;
  @Input() buttonStyles: any = {
    'background-color': 'var(--color-light)',
    color: 'var(--color-dark)',
    'font-size': '1.5rem',
    width: '250px',
    'margin-bottom': '1rem',
  };
}
