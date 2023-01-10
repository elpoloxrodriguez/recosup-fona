import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';


export interface IUsuario{
  nombre : string,
  cedula : string,
  tipo : string,
  componente : string,
  clave : string,
  correo : string,
}

export interface IToken{
  token : string,
}

export interface UClave{
  login: string,
  clave : string,
  nueva: string,
  repetir: string,
  correo : string,
}

@Injectable({
  providedIn: 'root'
})



export class LoginService {
 
  public URL : string =  environment.API
  
  public Id : string = ''
  
  public SToken : any

  public Token : any

  public Usuario : any

  public Aplicacion : any

  constructor(private router: Router, private http : HttpClient) {
    this.Id = environment.ID
    if (sessionStorage.getItem("token") != undefined ) this.SToken = sessionStorage.getItem("token");
  }

  async Iniciar() {
    await this.getUserDecrypt()
    return this.obenterAplicacion()
  }
  getLogin(user: string, clave : string) : Observable<IToken>{
    var usuario = {
      "nombre" : user,
      "clave" : clave,
    }
    var url =  this.URL + 'wusuario/login'
    return this.http.post<IToken>(url, usuario )
  }

    getLoginExternas(parametro: any) : Observable<IToken>{
    // const token = localStorage.getItem('token')
    //     const config = {
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Access-Control-Allow-Origin': '*',
    //             'Access-Control-Allow-Methods': ' GET, POST, OPTIONS',
    //             'Access-Control-Allow-Headers': 'Origin, Accept, X-Auth-Token',
    //             'Authorization': 'Bearer ' + token
    //         }
    //     }
    // var url = 'https://recosup.fona.gob.ve' + this.URL + 'wusuario/access'
    var url = this.URL + 'wusuario/access'
    return this.http.post<IToken>(url, parametro )
  }
  
  makeUser(user: IUsuario): Observable<any>{    
    var url = this.URL + 'identicacion'   
    return this.http.post<any>( url, user )
  }

  logout(){
    Swal.fire({
      title: 'Desea cerrar sesión?',
      text: "Gracias por su tiempo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        Swal.fire(
          'Hasta la próxima!',
          'Te esperamos',
          'success'
        )
        this.router.navigate(['login']);
        sessionStorage.clear();
        localStorage.clear();
      }
    })
  }

  protected getUserDecrypt() : any {    
    var e = sessionStorage.getItem("token");
    var s = e.split(".");
    
    //var str = Buffer.from(s[1], 'base64').toString();
    var str = atob( s[1] );
    this.Token = JSON.parse(str)
    // console.info(this.Token)
    this.Usuario = this.Token.Usuario
    return JSON.parse(str);
  }
  
  //ObenterAplicacion 
  protected obenterAplicacion(){
    var Aplicacion = this.Token.Usuario.Aplicacion
    Aplicacion.forEach(e => {
      if(e.id == this.Id ){
        this.Aplicacion = e;
      }
    });
    return this.Aplicacion
  }
  
  obtenerMenu() : any {
    var i = 0
    return  this.Aplicacion.Rol.Menu.map(e => {
      e.id = e.url
      e.type = e.clase
      e.title = e.descripcion
      if(  e.SubMenu != undefined ) {
        e.children = e.SubMenu.map(el => {
          el.id =   el.url.replace('/', '-')
          el.title = el.descripcion
          el.type = el.clase
          el.url =  el.url
          return el
        }) 
        e.url = ''
      }
      return e
    }) 
    // return this.Aplicacion.Rol.Menu
  }

  obtenerSubMenu(idUrl : string) : any{   
    var App = this.Aplicacion
    var SubMenu = [] 
    App.Rol.Menu.forEach(e => {if (e.url == idUrl) SubMenu = e.SubMenu});
    return SubMenu
  }

}
