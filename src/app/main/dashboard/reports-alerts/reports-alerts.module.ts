import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsAlertsRoutingModule } from './reports-alerts-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';

import { CoreCardModule } from '@core/components/core-card/core-card.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

//  USer
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
//  USer
import { AngularFileUploaderModule } from "angular-file-uploader";
import { AlertManagementComponent } from './alert-management/alert-management.component';
import { DefinitionAlertsComponent } from './definition-alerts/definition-alerts.component';
import { AlertedUsersConfigurationComponent } from './alerted-users-configuration/alerted-users-configuration.component';
import { DinamicReportsComponent } from './dinamic-reports/dinamic-reports.component';
import { StaticReportsComponent } from './static-reports/static-reports.component';





@NgModule({
  declarations: [
    AlertManagementComponent,
    DefinitionAlertsComponent,
    AlertedUsersConfigurationComponent,
    DinamicReportsComponent,
  ],
  imports: [
    CommonModule,
    ReportsAlertsRoutingModule,
    RouterModule,
    ContentHeaderModule,
    NgbModule,
    CardSnippetModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    NgxDatatableModule,
    NgSelectModule,
    CoreCardModule,
    Ng2FlatpickrModule,
    CoreDirectivesModule,
    CorePipesModule,
    CoreSidebarModule,
    AngularFileUploaderModule,
  ],
})

export class ReportsAlertsModule { }
