import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { CommunicationsComponent } from './communications/communications.component';
import { TaxpayersComponent } from './taxpayers/taxpayers.component';

const routes: Routes = [
  {
    path: 'digital-documentation/taxpayers',
    component: TaxpayersComponent,
    // canActivate:[AuthGuardGuard],
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9','1','2','3','4'] },

  },
  // {
  //   path: 'digital-documentation/communications',
  //   component: CommunicationsComponent,
  //   // canActivate:[AuthGuardGuard],
  //   canActivate: [AuthGuard,AuthGuardGuard],
  //   data: { roles: ['8','9'] },
  // },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalDocumentationRoutingModule { }
