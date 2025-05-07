import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() buttonText: string = 'Button';
  @Input() mainColor: string = '#363636';
  @Input() secondaryColor: string = '#fff';

  protected get buttonStyles() {
    return { 
      'background-color': this.secondaryColor, 
      color: this.mainColor 
    };
  }
}
