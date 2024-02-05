import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { BackupsComponent } from './backups/backups.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MenuModuleComponent } from './menu-module/menu-module.component';
import { PermissionsUserComponent } from './permissions-user/permissions-user.component';
import { RoleUserComponent } from './role-user/role-user.component';
import { TableManagementComponent } from './table-management/table-management.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { AuthGuard } from 'app/auth/helpers';
import { UsersComponent } from './users/users.component';
import { UsersStatusComponent } from './users-status/users-status.component';
import { UsersStatusGlobalComponent } from './users-status-global/users-status-global.component';


const routes: Routes = [
  {
    path: 'support/menu-module',
    component: MenuModuleComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['9'] },

  },
  {
    path: 'support/users-status',
    component: UsersStatusComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['1', '9'] },
  },
  {
    path: 'support/users-status-global',
    component: UsersStatusGlobalComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['1', '9'] },
  },
  {
    path: 'support/role-user',
    component: RoleUserComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['9'] },
  },
  {
    path: 'support/permissions-user',
    component: PermissionsUserComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: {
      roles: ['9']
    },

  },
  {
    path: 'support/table-management',
    component: TableManagementComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard, AuthGuardGuard],
    data: {
      roles: ['9']
    },
  },
  {
    path: 'support/change-password',
    component: ChangePasswordComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['9', '1'] },
  },
  {
    path: 'support/users',
    component: UsersComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['9'] },
  },
  {
    path: 'support/backups',
    component: BackupsComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['9'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, ContentHeaderModule]
})
export class SupportRoutingModule { }
