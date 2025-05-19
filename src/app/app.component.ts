import { Component, inject, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleAuthService } from './data/services/google-auth.service';
import { AnimatedBackgroundComponent } from "./ui/features/animated-background/animated-background.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AnimatedBackgroundComponent],
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
