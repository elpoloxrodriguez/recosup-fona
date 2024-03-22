import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


import { CoreConfigService } from '@core/services/config.service';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { LoginService } from '@core/services/seguridad/login.service';
import { UtilService } from '@core/services/util/util.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { WsocketsService } from '@core/services/websockets/wsockets.service';

@Component({
  selector: 'app-auth-forgot-password-v2',
  templateUrl: './auth-forgot-password-v2.component.html',
  styleUrls: ['./auth-forgot-password-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthForgotPasswordV2Component implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public pID

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private apiservice: ApiService,
    private utilservice: UtilService,
    private _formBuilder: FormBuilder,
    private http: HttpClient,
    private loginService: LoginService,
    private msjService: WsocketsService,
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  /**
   * On Submit
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });

  }



  async CrearTokenTemporal(usuario: any, password: any) {
    this.xAPI.funcion = 'RECOSUP_R_Login'
    this.xAPI.parametros = usuario + ',' + password
    this.xAPI.valores = ''
    await this.loginService.getLoginExternas(this.xAPI).subscribe(
      (data) => {
        sessionStorage.setItem("token", data.token);
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async EvaluarCorreo() {
    if (this.forgotPasswordForm.value.email != '') {
      this.xAPI.funcion = 'RECOSUP_R_RecuperarPassword'
      this.xAPI.parametros = `${this.forgotPasswordForm.value.email}`
      this.xAPI.valores = ''
      await this.apiservice.EjecutarDev(this.xAPI).subscribe(
        async (data) => {
          if (data.Cuerpo.length > 0) {
            data.Cuerpo.map(e => {
              this.Enviar(e)
            });
          } else {
            this.utilservice.AlertMini('top-end', 'error', 'Lo Sentimos!, No se encontro el Correo Electronico en el sistema.', 3000)
            sessionStorage.clear();
            localStorage.clear();
          }
          sessionStorage.clear();
          localStorage.clear();
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }

  Enviar(data: any) {
    const claveTemporal = this.utilservice.GenerarUnicId()
    this.CrearTokenTemporal(data.Codigo, data.Clave)

    let email = {
      "funcion": "Fnx_EnviarMailCurl",
      "API_KEY": "re_DXyM5aC2_3HYUw2whmaEqSQPUDanuwRZP",
      "from": "RECOSUP <forgot-password@code-epic.com>",
      "to": data.CorreoPrincipal,
      // "archivo": 'assets/images/logo/fona.jpeg',
      "subject": "Recuperación de Contraseña 🔐",
      "html": `<h2>Hola! estimado: <strong>${data.Nombres} ${data.Apellidos}</strong></h2> <p>Alguien solicitó recientemente un restablecimiento de contraseña para su cuenta RECOSUP. Si eres tú, puedes establecer una nueva contraseña</p> <p>Su contraseña temporal es <strong><h3>${claveTemporal}</h3></strong></p> <p>Si no desea cambiar su contraseña o no lo solicitó, simplemente ignore y elimine este mensaje.</p> <p>Para mantener su cuenta segura, no reenvíe este correo electrónico a nadie.</p> <p>Una vez ingrese al sistema, se recomienda inmediatamente cambiar la contraseña, para evitar robo y/o estravio de datos en su cuenta.</p> <p>Gracias,</p> <p>El Equipo de Soporte</p>`
    }
    this.apiservice.ExecFnx(email).subscribe(
      (da) => {
        // this.ConsultarPID(da.contenido.id)
        this.pID = da.contenido.id;
        console.log(this.pID)
        this.msjService.lstpid$.emit(this.pID);
        this.ActualizarClave(data.CorreoPrincipal, claveTemporal)
        this.forgotPasswordForm = this._formBuilder.group({
          email: ['']
        });
      },
      (e) => {
        this.utilservice.AlertMini('top-end', 'error', 'Oops lo sentimo!, el correo no se puedo enviar intente de nuevo mas tarde.', 3000)
        sessionStorage.clear();
        localStorage.clear();
      }
    )
  }



  async ActualizarClave(CorreoPrincipal, claveTemporal) {
    let campos = {
      correo: CorreoPrincipal,
      clave: this.utilservice.md5(claveTemporal),
    }
    this.xAPI.funcion = "RECOSUP_U_ResetPassword";
    this.xAPI.valores = JSON.stringify(campos)
    await this.apiservice.Ejecutar(this.xAPI).subscribe(
      (datax) => {
        this.utilservice.AlertMini('top-end', 'success', 'Felicidades!, en aproximadamente 5 minutos recibira instrucciones via correo electronico.', 3000)
        sessionStorage.clear();
        localStorage.clear();
      },
      (error) => {
        this.utilservice.AlertMini('top-end', 'error', 'Oops lo sentimo!, el correo no se puedo enviar intente de nuevo mas tarde.', 3000)
        sessionStorage.clear();
        localStorage.clear();
      }
    )
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
