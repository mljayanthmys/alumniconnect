import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { DirectoryComponent } from './components/directory/directory.component';
import { RegisterComponent } from './components/register/register.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'directory', component: DirectoryComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'update-profile/:id', component: UpdateProfileComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' },
];
