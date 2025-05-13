import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAuthService } from './data/services/google-auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class AppComponent {
  title = 'world-flags';
  private googleAuthService = inject(GoogleAuthService);

  constructor() {
    this.googleAuthService.initAfterRedirect();
  }
}
