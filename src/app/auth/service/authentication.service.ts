import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IToken, LoginService } from '@core/services/seguridad/login.service';
import jwt_decode from "jwt-decode";

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;
  public token
  public iToken: IToken = { token: '', };
  public itk: IToken;


  //private
  // private currentUserSubject: BehaviorSubject<User>;
  private currentUserSubject;
  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(
    private _http: HttpClient,
    private _toastrService: ToastrService,
    private loginService: LoginService,
    ) {

      if (sessionStorage.getItem('token') != undefined && sessionStorage.getItem('token') != null) {
        this.token = jwt_decode(sessionStorage.getItem('token')) 
        this.currentUserSubject = new BehaviorSubject(this.token.Usuario[0])
        this.currentUser = this.currentUserSubject.asObservable();
      }  else {        
        this.currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    // console.log(this.token.Usuario[0])
    // console.log(JSON.parse(localStorage.getItem('currentUser')))
  }
  
  // getter: currentUserValue
  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
     return this.currentUser && this.currentUserSubject.value.role === Role.Administrador;
  //   return this.currentUser && this.token=== Role.Administrador;
  }
  
  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Usuario;
    // return this.currentUser && this.token === Role.Usuario;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.apiUrl}/v1/api/wusuario/access`, { email, password })
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'You have successfully logged in as an ' +
                  user.role +
                  ' user to Vuexy. Now you can start to explore. Enjoy! 🎉',
                '👋 Welcome, ' + user.firstName + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        })
      );
  }


  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
