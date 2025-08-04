import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { ImagesListComponent } from './images/images-list';
import { ImagesUploadComponent } from './images/images-upload';

export const routes: Routes = [
  {
    path: '',
    component: ImagesListComponent,
    canActivate: [
      /* your auth guard */
    ],
  },
  {
    path: 'upload',
    component: ImagesUploadComponent,
    canActivate: [
      /* your auth guard */
    ],
  },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/home' },
];
