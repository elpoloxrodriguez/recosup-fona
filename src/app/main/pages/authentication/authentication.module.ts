import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';



import { AuthLoginV2Component } from 'app/main/pages/authentication/auth-login-v2/auth-login-v2.component';
import { AuthResetPasswordV2Component } from './auth-reset-password-v2/auth-reset-password-v2.component';
import { AuthForgotPasswordV2Component } from './auth-forgot-password-v2/auth-forgot-password-v2.component';
import { AuthRegisterV2Component } from './auth-register-v2/auth-register-v2.component';
import { CertificatesComponent } from './certificates/certificates.component';
import { LoginInternalComponent } from './login-internal/login-internal.component';
import { AuthRegisterUsersComponent } from './auth-register-users/auth-register-users.component';



// routing
const routes: Routes = [
  {
    path: 'login',
    component: AuthLoginV2Component,
  },
  {
    path: 'admin-recosup',
    component: LoginInternalComponent,
  },
  // {
  //   path: 'login/:id',
  //   component: AuthLoginV2Component,
  // },
  {
    path: '',
    component: AuthLoginV2Component,
  },
  {
    path: 'register-taxpayer',
    component: AuthRegisterUsersComponent,
  },
  {
    path: 'reset-password',
    component: AuthResetPasswordV2Component
  },
  {
    path: 'forgot-password',
    component: AuthForgotPasswordV2Component
  }
];

@NgModule({
  declarations: [
                          CertificatesComponent,
                          AuthLoginV2Component,
                          AuthRegisterV2Component,
                          AuthResetPasswordV2Component,
                          AuthForgotPasswordV2Component,
                          LoginInternalComponent,
                          AuthRegisterUsersComponent,
],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule,  NgSelectModule,
    FormsModule, ReactiveFormsModule, CoreCommonModule, ContentHeaderModule,
    CardSnippetModule]
})
export class AuthenticationModule {}
