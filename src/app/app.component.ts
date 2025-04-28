import { Component, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageComponent } from "./ui/features/homepage/homepage.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomepageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
})
export class AppComponent {
  title = 'world-flags';
}
