import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NgSelectModule } from '@ng-select/ng-select'
import { CoreCommonModule } from '@core/common.module'
import { TranslateModule } from '@ngx-translate/core'
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';
import { CompanyProjectsComponent } from './company-projects/company-projects.component'
import { CompanyProjectsRecosupComponent } from './company-projects-recosup/company-projects-recosup.component'
import { ReportsProjectsComponent } from './reports/reports-projects/reports-projects.component'
import { ProjectEvaluationComponent } from './project-evaluation/project-evaluation.component'
import { AdminEvaluationProjectComponent } from './admin-evaluation-project/admin-evaluation-project.component'


const routes: Routes = [
  {
    path: 'projects/company-projects',
    component: CompanyProjectsComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['9','4','0'] },
  },
  {
    path: 'projects/company-projects-recosup',
    component: CompanyProjectsRecosupComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['4','9'] },
  },
  {
    path: 'projects/project-evaluation',
    component: AdminEvaluationProjectComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['4','9'] },
  },
  {
    path: 'projects/reports',
    component: ReportsProjectsComponent,
    canActivate: [AuthGuard,AuthGuardGuard],
    data: { roles: ['4','9'] },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    CoreCommonModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
