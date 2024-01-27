import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthGuard } from 'app/auth/helpers';

import { CoreCommonModule } from '@core/common.module';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { CoreCardModule } from '@core/components/core-card/core-card.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { NgSelectModule } from '@ng-select/ng-select';

import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';
import { BlockUIModule } from 'ng-block-ui';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { PanelAsistenteVirtualComponent } from './panel-asistente-virtual/panel-asistente-virtual.component';

const routes = [
  {
    path: 'virtual-assistant',
    component: PanelAsistenteVirtualComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9'] },
  },
]


@NgModule({
  declarations: [
    PanelAsistenteVirtualComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    ContentHeaderModule,
    TranslateModule,
    FormsModule,
    CoreCardModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgbModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    CoreDirectivesModule,
    BlockUIModule,
    CorePipesModule,
    CoreSidebarModule,
    CoreCommonModule,
  ]
})
export class AsistenteVirtualModule { }
