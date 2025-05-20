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
  {
    path: 'rules',
    loadComponent: () =>
      import('./ui/features/rules/rules.component').then(
        (mod) => mod.RulesComponent
      ),
  },
  {
    path: 'sign-up',
    loadComponent: () =>
      import('./ui/features/sign-up/sign-up.component').then(
        (mod) => mod.SignUpComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./ui/features/forgot-password/forgot-password.component').then(
        (mod) => mod.ForgotPasswordComponent
      ),
  },
];
