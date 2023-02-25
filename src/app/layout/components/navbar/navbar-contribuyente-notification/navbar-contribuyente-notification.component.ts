import { Component, Input, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";

import { NotificationsService } from 'app/layout/components/navbar/navbar-notification/notifications.service';
import { UtilService } from '@core/services/util/util.service';

interface notification {
  messages: []
  systemMessages: [];
  system: Boolean;
}

@Component({
  selector: 'app-navbar-contribuyente-notification',
  templateUrl: './navbar-contribuyente-notification.component.html',
  styleUrls: ['./navbar-contribuyente-notification.component.scss']
})
export class NavbarContribuyenteNotificationComponent implements OnInit {

  public token

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };
  
  public Notificaciones = []

  public link : string

  // Public
  public notifications: notification;

  /**
   *
   * @param {NotificationsService} _notificationsService
   */
  constructor(
    private _notificationsService: NotificationsService,
    private apiService : ApiService,
    private utilService: UtilService,
    ) {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    this.token =  jwt_decode(sessionStorage.getItem('token'));
    if (this.token.Usuario[0].EsAdministrador == '0' || this.token.Usuario[0].EsAdministrador == '1') {
     switch (this.token.Usuario[0].EsAdministrador) {
      case '0':
        await this.NotificacionesTotal()
        this.link = '/taxpayer-record/current-fines'
        this._notificationsService.onApiDataChange.subscribe(res => {
         this.notifications = res;
        });
        break;
        case '1':
          await this.NotificacionesPagosMultas()
          this.link = '/financial-collection/generate-fines'
          this._notificationsService.onApiDataChange.subscribe(res => {
           this.notifications = res;
          });
          break;
      default:
        break;
     }
    } else {
      this.notifications
    }
  }


  async NotificacionesTotal(){
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF_ID";
    this.xAPI.parametros = this.token.Usuario[0].EmpresaId
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.status_mif == '0') {
            e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
            e.Monto_mif = this.utilService.ConvertirMoneda(e.Monto_mif)
            this.Notificaciones.push(e)
            }
        });
        // console.log(this.Notificaciones)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async NotificacionesPagosMultas(){
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF";
    this.xAPI.parametros = ''
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.status_mif == '2') {
            e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
            e.Monto_mif = this.utilService.ConvertirMoneda(e.Monto_mif)
            this.Notificaciones.push(e)
            }
        });
        // console.log(this.Notificaciones)
      },
      (error) => {
        console.log(error)
      }
    )
  }


}
