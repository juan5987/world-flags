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
    path: 'play',
    loadComponent: () =>
      import('./ui/features/play/play.component').then(
        (mod) => mod.PlayComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./ui/features/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
];
