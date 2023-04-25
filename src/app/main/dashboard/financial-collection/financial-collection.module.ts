import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';


import { NgxMaskModule, IConfig } from 'ngx-mask'



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


import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { ContributingCompaniesComponent } from './contributing-companies/contributing-companies.component';
import { TaxpayerPaymentsComponent } from './taxpayer-payments/taxpayer-payments.component';
import { GoalManagementComponent } from './goal-management/goal-management.component';
import { TranslateModule } from '@ngx-translate/core';
import { GenerateFinesComponent } from './generate-fines/generate-fines.component';
import { ReportsComponent } from './reports/reports.component';
import { GenerateNonRegisteredFinesComponent } from './generate-non-registered-fines/generate-non-registered-fines.component';



@NgModule({
  declarations: [
  ],
  imports: [
    NgxMaskModule.forRoot(),
    TranslateModule,
    CommonModule,
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
  ],
})
export class FinancialCollectionModule { }
