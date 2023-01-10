import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreCommonModule } from '@core/common.module';

import { ErrorComponent } from 'app/main/pages/miscellaneous/error/error.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';

// routing
const routes: Routes = [
  {
    path: 'miscellaneous/error',
    component: ErrorComponent,
    data: { animation: 'misc' }
  },
  {
    path: 'miscellaneous/maintenance',
    component: MaintenanceComponent
  },
  {
    path: 'miscellaneous/not-authorized',
    component: NotAuthorizedComponent,
    data: { animation: 'misc' }
  },
];

@NgModule({
  declarations: [ErrorComponent, MaintenanceComponent, NotAuthorizedComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CoreCommonModule]
})
export class MiscellaneousModule {}
