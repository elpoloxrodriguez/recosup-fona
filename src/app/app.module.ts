import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {DatePipe} from '@angular/common';


import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr'; // For auth after login toast

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { coreConfig } from 'app/app-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { DashboardModule } from 'app/main/dashboard/dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


// Subir Archivos
import { AngularFileUploaderModule } from "angular-file-uploader";
import { TaxpayerPaymentsComponent } from './main/dashboard/financial-collection/taxpayer-payments/taxpayer-payments.component';
import { ContributingCompaniesComponent } from './main/dashboard/financial-collection/contributing-companies/contributing-companies.component';
import { GoalManagementComponent } from './main/dashboard/financial-collection/goal-management/goal-management.component';
import { DeclarationPaymentsComponent } from './main/dashboard/taxpayer-record/declaration-payments/declaration-payments.component';
import { TaxpayersComponent } from './main/dashboard/digital-documentation/taxpayers/taxpayers.component';
import { CommunicationsComponent } from './main/dashboard/digital-documentation/communications/communications.component';
import { HashLocationStrategy, JsonPipe, LocationStrategy } from '@angular/common';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthInterceptorService } from '@core/services/seguridad/auth-interceptor.service';
import { AlertManagementComponent } from './main/dashboard/reports-alerts/alert-management/alert-management.component';
import { DefinitionAlertsComponent } from './main/dashboard/reports-alerts/definition-alerts/definition-alerts.component';
import { AlertedUsersConfigurationComponent } from './main/dashboard/reports-alerts/alerted-users-configuration/alerted-users-configuration.component';
import { DinamicReportsComponent } from './main/dashboard/reports-alerts/dinamic-reports/dinamic-reports.component';
import { StaticReportsComponent } from './main/dashboard/reports-alerts/static-reports/static-reports.component';
import { MenuModuleComponent } from './main/dashboard/support/menu-module/menu-module.component';
import { RoleUserComponent } from './main/dashboard/support/role-user/role-user.component';
import { PermissionsUserComponent } from './main/dashboard/support/permissions-user/permissions-user.component';
import { TableManagementComponent } from './main/dashboard/support/table-management/table-management.component';
import { ChangePasswordComponent } from './main/dashboard/support/change-password/change-password.component';
import { BackupsComponent } from './main/dashboard/support/backups/backups.component';
import { AuthLoginV2Component } from './main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { ErrorInterceptor, JwtInterceptor } from './auth/helpers';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from './layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { ChartsModule } from 'ng2-charts';
import { UsersComponent } from './main/dashboard/support/users/users.component';
import { ReportsComponent } from './main/dashboard/financial-collection/reports/reports.component'
import { CompanyProjectsRecosupComponent } from './main/dashboard/projects/company-projects-recosup/company-projects-recosup.component';
import { GenerateFinesComponent } from './main/dashboard/financial-collection/generate-fines/generate-fines.component';
import { ReportsProjectsComponent } from './main/dashboard/projects/reports/reports-projects/reports-projects.component';
import { GenerateNonRegisteredFinesComponent } from './main/dashboard/financial-collection/generate-non-registered-fines/generate-non-registered-fines.component';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
//  subir Archivos


const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: '**',
    redirectTo: '/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [AppComponent,
                          AlertManagementComponent,
                          DefinitionAlertsComponent,
                          StaticReportsComponent,
                          MenuModuleComponent,
                          ReportsComponent,
                          ReportsProjectsComponent,
                           GoalManagementComponent,

                          ],
  imports: [
    BrowserModule,
    NgxDatatableModule,
    ChartsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy',
      useHash: true
    }),
    TranslateModule.forRoot(),
    BlockUIModule.forRoot(),
    //NgBootstrap
    NgbModule,
    ToastrModule.forRoot({}),

    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    AngularFileUploaderModule,
    CoreThemeCustomizerModule,
    
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,

    // App modules
    LayoutModule,
    DashboardModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    // PagesModule
  ],
  providers: [
    {
      provide: [ LocationStrategy, AuthGuardGuard,  JsonPipe],
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
