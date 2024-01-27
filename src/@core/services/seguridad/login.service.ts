import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import Swal from 'sweetalert2';
import { Auditoria, InterfaceService } from '../../../app/main/dashboard/audit/auditoria.service';
import { UtilService } from '../util/util.service';
import jwt_decode from "jwt-decode";

export interface IUsuario {
  nombre: string,
  cedula: string,
  tipo: string,
  componente: string,
  clave: string,
  correo: string,
}

export interface IToken {
  token: string,
}

export interface UClave {
  login: string,
  clave: string,
  nueva: string,
  repetir: string,
  correo: string,
}

@Injectable({
  providedIn: 'root'
})




export class LoginService {

  public xAuditoria: Auditoria = {
    id: '',
    usuario: '',
    metodo: '',
    fecha: '',
  }


  public URL: string = environment.API

  public Id: string = ''

  public SToken: any

  public Token: any

  public Usuario: any

  public Aplicacion: any

  public token

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilservice: UtilService,
    private auditoria: InterfaceService
  ) {
    this.Id = environment.ID
    if (sessionStorage.getItem("token") != undefined) this.SToken = sessionStorage.getItem("token");
  }

  async Iniciar() {
    await this.getUserDecrypt()
    return this.obenterAplicacion()
  }
  getLogin(user: string, clave: string): Observable<IToken> {
    var usuario = {
      "nombre": user,
      "clave": clave,
    }
    var url = this.URL + 'wusuario/login'
    return this.http.post<IToken>(url, usuario)
  }


  getLoginExternas(parametro: any): Observable<IToken> {
    if (environment.production === true) {
      var url = this.URL + 'wusuario/access'
    } else {
      // var url =  this.URL + 'wusuario/access'
      var url = '/v1/api/wusuario/access'
    }
    return this.http.post<IToken>(url, parametro)
  }

  makeUser(user: IUsuario): Observable<any> {
    var url = this.URL + 'identicacion'
    return this.http.post<any>(url, user)
  }

  logout() {
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

        // Swal.fire(
        //   'Hasta la próxima!',
        //   'Te esperamos',
        //   'success'
        // )

        // INICIO AGREGAR AUDITORIA //
        this.token = jwt_decode(sessionStorage.getItem('token'));
        this.xAuditoria.id = this.utilservice.GenerarUnicId()
        this.xAuditoria.usuario = this.token.Usuario[0]
        this.xAuditoria.funcion = 'RECOSUP_R_Desconexion'
        this.xAuditoria.metodo = 'Salio del Sistema'
        this.xAuditoria.fecha = Date()
        this.auditoria.InsertarInformacionAuditoria(this.xAuditoria)
        // FIN AGREGAR AUDITORIA //
        if (this.token.Usuario[0].role == '0') {
          this.router.navigate(['login']).then(() => { window.location.reload() });
        } else {
          this.router.navigate(['admin-recosup']).then(() => { window.location.reload() });
        }
        sessionStorage.clear();
        localStorage.clear();
      }
    })
  }

  protected getUserDecrypt(): any {
    var e = sessionStorage.getItem("token");
    var s = e.split(".");

    //var str = Buffer.from(s[1], 'base64').toString();
    var str = atob(s[1]);
    this.Token = JSON.parse(str)
    // console.info(this.Token)
    this.Usuario = this.Token.Usuario
    return JSON.parse(str);
  }

  //ObenterAplicacion 
  protected obenterAplicacion() {
    var Aplicacion = this.Token.Usuario.Aplicacion
    Aplicacion.forEach(e => {
      if (e.id == this.Id) {
        this.Aplicacion = e;
      }
    });
    return this.Aplicacion
  }

  obtenerMenu(): any {
    var i = 0
    return this.Aplicacion.Rol.Menu.map(e => {
      e.id = e.url
      e.type = e.clase
      e.title = e.descripcion
      if (e.SubMenu != undefined) {
        e.children = e.SubMenu.map(el => {
          el.id = el.url.replace('/', '-')
          el.title = el.descripcion
          el.type = el.clase
          el.url = el.url
          return el
        })
        e.url = ''
      }
      return e
    })
    // return this.Aplicacion.Rol.Menu
  }

  obtenerSubMenu(idUrl: string): any {
    var App = this.Aplicacion
    var SubMenu = []
    App.Rol.Menu.forEach(e => { if (e.url == idUrl) SubMenu = e.SubMenu });
    return SubMenu
  }

}
