import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { AlertManagementComponent } from './alert-management/alert-management.component';
import { AlertedUsersConfigurationComponent } from './alerted-users-configuration/alerted-users-configuration.component';
import { DefinitionAlertsComponent } from './definition-alerts/definition-alerts.component';
import { DinamicReportsComponent } from './dinamic-reports/dinamic-reports.component';
import { StaticReportsComponent } from './static-reports/static-reports.component';


const routes: Routes = [
  {
    path: 'reports-alerts/alert-management',
    component: AlertManagementComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9']  },
  },
  {
    path: 'reports-alerts/definition-alerts',
    component: DefinitionAlertsComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9']  },
  },
  {
    path: 'reports-alerts/alerted-users-configuration',
    component: AlertedUsersConfigurationComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9']  },
  },
  {
    path: 'reports-alerts/dinamic-reports',
    component: DinamicReportsComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9']  },
  },
  {
    path: 'reports-alerts/static-reports',
    component: StaticReportsComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9']  },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsAlertsRoutingModule { }
