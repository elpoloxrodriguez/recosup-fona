import { Component, Input, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { NotificationsService } from '../navbar-notification/notifications.service';

interface notification {
  messages: []
  systemMessages: [];
  system: Boolean;
}


@Component({
  selector: 'app-navbar-project-notification',
  templateUrl: './navbar-project-notification.component.html',
  styleUrls: ['./navbar-project-notification.component.scss']
})
export class NavbarProjectNotificationComponent implements OnInit {

  public token

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public Notificaciones = []

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
    this.token = jwt_decode(sessionStorage.getItem('token'));
    if (this.token.Usuario[0].EsAdministrador == '9' || this.token.Usuario[0].EsAdministrador == '10' || this.token.Usuario[0].EsAdministrador == '4') {
      await this.NotificacionesTotal()
      this._notificationsService.onApiDataChange.subscribe(res => {
        this.notifications = res;
      });
    } else {
      this.notifications
    }
  }


  async NotificacionesTotal() {
    this.xAPI.funcion = "RECOSUP_R_ProjectsNotifications";
    this.xAPI.parametros = '2,0'
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.Notificaciones.push(e)
        });
        // console.log(this.Notificaciones)
      },
      (error) => {
        console.log(error)
      }
    )
  }


}
