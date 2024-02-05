import { Component, NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select'
import { CoreCommonModule } from '@core/common.module'
import { TranslateModule } from '@ngx-translate/core'
import { DashboardComponent } from './principal/dashboard.component'
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';


import { TaxpayerRecordRoutingModule } from './taxpayer-record/taxpayer-record-routing.module'
import { FinancialCollectionRoutingModule } from './financial-collection/financial-collection-routing.module'
import { DigitalDocumentationRoutingModule } from './digital-documentation/digital-documentation-routing.module'
import { ReportsAlertsRoutingModule } from './reports-alerts/reports-alerts-routing.module'
import { SupportRoutingModule } from './support/support-routing.module'
import { LegalRoutingModule } from './legal/legal-routing.module'
import { InspectionRoutingModule } from './inspection/inspection-routing.module'
import { UserRoutingModule } from './user/user-routing.module'
import { AuditModule } from '../audit/audit.module'
import { AsistenteVirtualModule } from '../asistente-virtual/asistente-virtual.module'

const routes: Routes = [
  {
    path: 'home',
    component: DashboardComponent,
    canActivate: [AuthGuard, AuthGuardGuard],
    data: { roles: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] },
  },
  {
    path: 'email',
    loadChildren: () => import('./email/email.module').then(m => m.EmailModule)
  },
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    TaxpayerRecordRoutingModule,
    FinancialCollectionRoutingModule,
    DigitalDocumentationRoutingModule,
    ReportsAlertsRoutingModule,
    SupportRoutingModule,
    LegalRoutingModule,
    InspectionRoutingModule,
    CommonModule,
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    UserRoutingModule,
    AuditModule,
    AsistenteVirtualModule
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule {


}
