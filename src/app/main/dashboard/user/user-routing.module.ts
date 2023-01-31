import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {
    path: 'user/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    // data: { roles: ['9'] },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
