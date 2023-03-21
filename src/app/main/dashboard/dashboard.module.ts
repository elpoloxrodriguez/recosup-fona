import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MiscellaneousModule } from '../pages/miscellaneous/miscellaneous.module';


import { DashboardComponent } from './principal/dashboard.component';
import { RegistrationManagementComponent } from './taxpayer-record/registration-management/registration-management.component';
import { TaxpayerPaymentsComponent } from './financial-collection/taxpayer-payments/taxpayer-payments.component';
import { CompanyProjectsComponent } from './projects/company-projects/company-projects.component';
import { ProjectsRoutingModule } from './projects/projects-routing.module';
import { UsersComponent } from './support/users/users.component';
import { UsersStatusComponent } from './support/users-status/users-status.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ListCurrentFinesComponent } from './taxpayer-record/list-current-fines/list-current-fines.component';
import { DeclarationPaymentsComponent } from './taxpayer-record/declaration-payments/declaration-payments.component';
import { TableManagementComponent } from './support/table-management/table-management.component';
import { RoleUserComponent } from './support/role-user/role-user.component';
import { PermissionsUserComponent } from './support/permissions-user/permissions-user.component';
import { ChangePasswordComponent } from './support/change-password/change-password.component';
import { BackupsComponent } from './support/backups/backups.component';
import { CompanyProjectsRecosupComponent } from './projects/company-projects-recosup/company-projects-recosup.component';
import { GoalManagementComponent } from './financial-collection/goal-management/goal-management.component';
import { GenerateNonRegisteredFinesComponent } from './financial-collection/generate-non-registered-fines/generate-non-registered-fines.component';
import { GenerateFinesComponent } from './financial-collection/generate-fines/generate-fines.component';
import { ContributingCompaniesComponent } from './financial-collection/contributing-companies/contributing-companies.component';
import { TaxpayersComponent } from './digital-documentation/taxpayers/taxpayers.component';


@NgModule({
    declarations: [
      DashboardComponent,
      RegistrationManagementComponent,
      TaxpayerPaymentsComponent,
      ListCurrentFinesComponent,
      CompanyProjectsComponent,
      UsersComponent,
      UsersStatusComponent,
      ProfileComponent,
      DeclarationPaymentsComponent,
      TableManagementComponent,
      RoleUserComponent,
      PermissionsUserComponent,
      ChangePasswordComponent,
      BackupsComponent,
      CompanyProjectsRecosupComponent,
      GoalManagementComponent,
      GenerateNonRegisteredFinesComponent,
      GenerateFinesComponent,
      ContributingCompaniesComponent,
      TaxpayersComponent
    ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    DashboardRoutingModule,
    CommonModule,
    ProjectsRoutingModule,
    ContentHeaderModule,
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MiscellaneousModule,
  ],
  exports: [],
  providers: [DatePipe]

})
export class DashboardModule {
 




 


}



