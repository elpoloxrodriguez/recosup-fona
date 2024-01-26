import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DatePipe} from '@angular/common';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { RouterModule, Routes } from '@angular/router';

import { CoreSidebarModule } from '@core/components';
import { CorePipesModule } from '@core/pipes/pipes.module';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
// import { QuillModule } from 'ngx-quill';

// import { EmailComposeComponent } from 'app/main/apps/email/email-compose/email-compose.component';
// import { EmailDetailsComponent } from 'app/main/apps/email/email-details/email-details.component';
// import { EmailListComponent } from 'app/main/apps/email/email-list/email-list.component';
// import { EmailListItemComponent } from 'app/main/apps/email/email-list/email-list-item/email-list-item.component';
// import { EmailSidebarComponent } from 'app/main/apps/email/email-sidebar/email-sidebar.component';



import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';


import { EmailsRoutingModule } from './emails-routing.module';
import { EmailComponent } from './email.component';
import { EmailSidebarComponent } from './email-sidebar/email-sidebar.component';
import { EmailListComponent } from './email-list/email-list.component';
import { EmailDetailsComponent } from './email-details/email-details.component';
import { EmailListItemComponent } from './email-list/email-list-item/email-list-item.component';


@NgModule({
  declarations: [
    EmailComponent,
    EmailSidebarComponent,
    EmailListComponent,
    EmailDetailsComponent,
    EmailListItemComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    CommonModule,
    ContentHeaderModule,
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    EmailsRoutingModule,
    RouterModule,
    CoreSidebarModule,
    CorePipesModule,
    PerfectScrollbarModule,
  ]
})
export class EmailsModule { }
