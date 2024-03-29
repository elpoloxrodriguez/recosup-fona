import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { ContributingCompaniesComponent } from '../financial-collection/contributing-companies/contributing-companies.component';
import { LegalReportsComponent } from './legal-reports/legal-reports.component';
import { RecurringActsComponent } from './recurring-acts/recurring-acts.component';

const routes: Routes = [
  {
    path: 'legal/contributing-companies',
    component: ContributingCompaniesComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['9', '2'] },
  },
  {
    path: 'legal/recurring-acts',
    component: RecurringActsComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['9', '2'] },
  },
  {
    path: 'legal/reports',
    component: LegalReportsComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['9', '2'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalRoutingModule { }
