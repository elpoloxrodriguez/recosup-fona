import { Component, Input, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';

// Interface
interface notification {
  messages: []
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-notification',
  templateUrl: './navbar-notification.component.html'
})
export class NavbarNotificationComponent implements OnInit {

  public token

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public Notificaciones = []
  public rol

  // Public
  public notifications: notification;

  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(
    private _notificationsService: NotificationsService,
    private apiService: ApiService,
  ) { }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    if (sessionStorage.getItem('token') != null) {
      this.token = jwt_decode(sessionStorage.getItem('token'));
      this.rol = this.token.Usuario[0].EsAdministrador
      // if (this.token.Usuario[0].EsAdministrador == '9' || this.token.Usuario[0].EsAdministrador == '10' || this.token.Usuario[0].EsAdministrador == '1') {
      await this.NotificacionesTotal()
      this._notificationsService.onApiDataChange.subscribe(res => {
        this.notifications = res;
      });
      // } else {
      //   this.notifications
      // }
    }
  }


  async NotificacionesTotal() {
    this.xAPI.funcion = "RECOSUP_R_Listar_Pagos_Contribuyentes";
    this.xAPI.parametros = '17'
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.Notificaciones.push(e ? e : 0)
        });
        // console.log(this.Notificaciones)
      },
      (error) => {
        console.log(error)
      }
    )
  }


}


