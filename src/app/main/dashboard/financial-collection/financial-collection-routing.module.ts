import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { ContributingCompaniesComponent } from './contributing-companies/contributing-companies.component';
import { GenerateFinesComponent } from './generate-fines/generate-fines.component';
import { GenerateNonRegisteredFinesComponent } from './generate-non-registered-fines/generate-non-registered-fines.component';
import { GoalManagementComponent } from './goal-management/goal-management.component';
import { ReportsComponent } from './reports/reports.component';
import { TaxpayerPaymentsComponent } from './taxpayer-payments/taxpayer-payments.component';

const routes: Routes = [
  {
    path: 'financial-collection/contributing-companies',
    component: ContributingCompaniesComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9','1']  },
  },
  {
    path: 'financial-collection/taxpayer-payments',
    component: TaxpayerPaymentsComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9','1']  },
  },
  {
    path: 'financial-collection/goal-management',
    component: GoalManagementComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9','1']  },
  },
  {
    path: 'financial-collection/generate-fines',
    component: GenerateFinesComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9','1']  },
  },
  {
    path: 'financial-collection/generate-non-registered-fines',
    component: GenerateNonRegisteredFinesComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9','1']  },
  },
  {
    path: 'financial-collection/reports',
    component: ReportsComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9','1']  },
  },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialCollectionRoutingModule { }
