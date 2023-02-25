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



