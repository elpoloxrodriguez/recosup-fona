import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private router: Router, private loginService: LoginService ){ }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {     
    
      if (sessionStorage.getItem("token") != undefined ){
        return true;
      }else{
        console.log('Entrando');
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("id");
        this.router.navigate(['login']);
        return false;
      }
  }

  authConecting(): Promise<boolean> {    
    return new Promise<boolean>((resolv, reject) => {      
      // firebase.auth().onAuthStateChanged( user => {
      //   if(user){
      //     return resolv(true);
      //   }else{
      //     return reject(false);
      //   }
      // })
    })
  }



}