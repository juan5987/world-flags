import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  @Input() buttonText: string = 'Button';
  @Input() mainColor: string = '#363636';
  @Input() secondaryColor: string = '#fff';
  @Input() fontSize: string = '1.5rem';
  @Input() width: string = '300px';

  protected get buttonStyles() {
    return {
      'background-color': this.secondaryColor,
      color: this.mainColor,
      'font-size': this.fontSize,
      width: this.width,
    };
  }
}
