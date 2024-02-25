import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DatePipe } from '@angular/common';


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
import { GoalManagementComponent } from './main/dashboard/financial-collection/goal-management/goal-management.component';
import { HashLocationStrategy, JsonPipe, LocationStrategy } from '@angular/common';
import { AuthGuardGuard } from '@core/services/seguridad/auth-guard.guard';
import { AuthInterceptorService } from '@core/services/seguridad/auth-interceptor.service';
import { AlertManagementComponent } from './main/dashboard/reports-alerts/alert-management/alert-management.component';
import { DefinitionAlertsComponent } from './main/dashboard/reports-alerts/definition-alerts/definition-alerts.component';
import { StaticReportsComponent } from './main/dashboard/reports-alerts/static-reports/static-reports.component';
import { MenuModuleComponent } from './main/dashboard/support/menu-module/menu-module.component';
import { ErrorInterceptor, JwtInterceptor, fakeBackendProvider } from './auth/helpers';
import { BlockUIModule } from 'ng-block-ui';
import { ChartsModule } from 'ng2-charts';
import { ReportsComponent } from './main/dashboard/financial-collection/reports/reports.component'
import { ReportsProjectsComponent } from './main/dashboard/projects/reports/reports-projects/reports-projects.component';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';
//  subir Archivos






// Recaptcha V3
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

//  Recaptcha V2
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LegalReportsComponent } from './main/dashboard/legal/legal-reports/legal-reports.component';
import { AsistenteVirtualModule } from './main/asistente-virtual/asistente-virtual.module';

registerLocaleData(localeEs);

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
  },
  {
    path: '**',
    redirectTo: '/miscellaneous/error' //Error 404 - Page not found
  },
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
    LegalReportsComponent,
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
    NgbModule,
    ToastrModule.forRoot({}),
    // Core modules
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    AngularFileUploaderModule,
    CoreThemeCustomizerModule,

    //  Recaptcha V3
    RecaptchaV3Module,
    //  Recaptcha V2
    RecaptchaFormsModule,
    RecaptchaModule,

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
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: [LocationStrategy, AuthGuardGuard, JsonPipe], useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    //  Recaptcha V3
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
    // Recaptcha V2
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    // Fin de Recaptcha
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
