import { Routes } from '@angular/router';
import { HomepageComponent } from './ui/features/homepage/homepage.component';

export const routes: Routes = [{
    path: '',
    loadChildren: () => import('./ui/features/homepage/homepage.component').then(mod => mod.HomepageComponent),
  }];
