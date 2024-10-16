import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { AngularFileUploaderModule } from "angular-file-uploader";

import { SupportRoutingModule } from './support-routing.module';


@NgModule({
  declarations: [
    // ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
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
  ]
})
export class SupportModule { }
