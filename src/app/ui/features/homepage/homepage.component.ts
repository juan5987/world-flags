import { Component, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-homepage',
  imports: [ButtonComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class HomepageComponent {

}
