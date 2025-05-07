import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./ui/features/homepage/homepage.component').then(
        (mod) => mod.HomepageComponent
      ),
  },
  {
    path: 'launch',
    loadComponent: () =>
      import('./ui/features/launch/launch.component').then(
        (mod) => mod.LaunchComponent
      ),
  },
];
