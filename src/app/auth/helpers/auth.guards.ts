import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import jwt_decode from "jwt-decode";

import { AuthenticationService } from 'app/auth/service';
import { UtilService } from '@core/services/util/util.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */

  public token

  constructor(private _router: Router, private utilservice: UtilService , private _authenticationService: AuthenticationService) {}

  // canActivate
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.token = jwt_decode(sessionStorage.getItem('token'))

    // console.log(this.token.exp)
    // var data = 1682578227;
    // var date = new Date(data * 1000).toISOString();
    // console.log(date)

    // console.log(new Date(this.utilservice.FechaActual() * 1000))
    // const date = new Date(this.token.exp);
    // console.log(date)

    // const currentUser = this._authenticationService.currentUserValue;
     const currentUser = 
     { 
       role:this.token.Usuario[0].EsAdministrador
      }
      // console.log(this.token.Usuario[0].EsAdministrador)

    if (currentUser) {
      if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
        this._router.navigate(['/miscellaneous/not-authorized']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
