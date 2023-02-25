import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { DeclarationPaymentsComponent } from './declaration-payments/declaration-payments.component';
import { ListCurrentFinesComponent } from './list-current-fines/list-current-fines.component';
import { RegistrationManagementComponent } from './registration-management/registration-management.component';

const routes: Routes = [
  {
    path: 'taxpayer-record/registration-management',
    component: RegistrationManagementComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['0','9'] },
  },
  {
    path: 'taxpayer-record/declaration-payments',
    component: DeclarationPaymentsComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['0','9']  },
  },
  {
    path: 'taxpayer-record/current-fines',
    component: ListCurrentFinesComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['0','9']  },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxpayerRecordRoutingModule { }
