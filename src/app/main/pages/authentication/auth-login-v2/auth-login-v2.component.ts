import { Component, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { IToken, LoginService } from '@core/services/seguridad/login.service';
import Swal from 'sweetalert2';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { UtilService } from '@core/services/util/util.service';
import jwt_decode from "jwt-decode";
import { AuthenticationService } from 'app/auth/service/authentication.service';

@Component({
  selector: 'app-auth-login-v2',
  templateUrl: './auth-login-v2.component.html',
  styleUrls: ['./auth-login-v2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLoginV2Component implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public usuario: string;
  public clave: string;

  //  QR certifucado
  public Qr

  public infoUsuario
  public iToken: IToken = { token: '', };
  public itk: IToken;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreMenuService: CoreMenuService,
    private apiService : ApiService,
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private loginService: LoginService,
    private _router: Router,
    private utilservice: UtilService,
    private _authenticationService: AuthenticationService

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
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    let urlQR = this._router.url
    if (urlQR  == undefined) {
      this.Qr = ''
    } else {
      this.Qr = urlQR.substring(7, urlQR.length  +1)
      // this.EmpresaRIF()
      this.Qr = ''
    }

    if (sessionStorage.getItem("token") != undefined) {
      this._router.navigate(['/home'])
      return
   }
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }


  async login() {
    this.submitted = true;
    this.loading = true;
    var Xapi = {
      "funcion": 'RECOSUP_R_Login',
      "parametros": this.usuario + ',' + this.clave
    }
    this.loginService.getLoginExternas(Xapi).subscribe(
      (data) => {
        this.itk = data;
        sessionStorage.setItem("token", this.itk.token);
        this.infoUsuario = jwt_decode(sessionStorage.getItem('token'));
        // console.log(this.infoUsuario.Usuario[0])
        // if (this.infoUsuario.Usuario[0].Estatus != 0) {
        //       this.utilservice.alertConfirmMini('success', `Bienvenido al FONA ${this.infoUsuario.Usuario[0].Nombres} ${this.infoUsuario.Usuario[0].Apellidos}`);
        //       this._router.navigate(['home']).then(() => {window.location.reload()});
        //       return;
        // } else {
        //   this.loading = false;
        //   this._router.navigate(['login']);
        //   sessionStorage.clear();
        //   localStorage.clear();  
        //   this.utilservice.alertConfirmMini('error','El usuario se encuentra inactivo, porfavor contactar a RECAUDACI??N FONA')
        // }
        switch (this.infoUsuario.Usuario[0].Estatus) {
          case '0':
            localStorage.clear();  
            sessionStorage.clear();
            this.loading = false;
            this._router.navigate(['login']);
            this.utilservice.alertConfirmMini('error','El usuario se encuentra inscrito Inactivo, porfavor contactar a RECAUDACI??N FONA')
            break;
          case '1':
            this.utilservice.alertConfirmMini('success', `Bienvenido al FONA ${this.infoUsuario.Usuario[0].Nombres} ${this.infoUsuario.Usuario[0].Apellidos}`);
            this._router.navigate(['home']).then(() => {window.location.reload()});
            break;
            // case '7':
            //   this.utilservice.alertConfirmMini('success', `Bienvenido al FONA ${this.infoUsuario.Usuario[0].Nombres} ${this.infoUsuario.Usuario[0].Apellidos}`);
            //   this._router.navigate(['home']).then(() => {window.location.reload()});
            //   break;
            //   case '9':
            //     this.utilservice.alertConfirmMini('success', `Bienvenido al FONA ${this.infoUsuario.Usuario[0].Nombres} ${this.infoUsuario.Usuario[0].Apellidos}`);
            //     this._router.navigate(['home']).then(() => {window.location.reload()});
            //     break;
            case '2':
              sessionStorage.clear();
              localStorage.clear();  
              this.loading = false;
              this._router.navigate(['login']);
              this.utilservice.alertConfirmMini('error','El usuario se encuentra Rechazado, porfavor contactar a RECAUDACI??N FONA')
              break;
              case '3':
                sessionStorage.clear();
                localStorage.clear();  
                this.loading = false;
                this._router.navigate(['login']);
                this.utilservice.alertConfirmMini('error','El usuario se encuentra Bloqueado, porfavor contactar a TECNOLOGIA FONA')
                break;
          default:
            // sessionStorage.clear();
            // localStorage.clear();  
            // this.loading = false;
            // this._router.navigate(['login']);
            // this.utilservice.alertConfirmMini('error','El usuario se encuentra Inactivo, porfavor contactar a RECAUDACI??N FONA')
            break;
        }
        // console.log(data)
        // if (sessionStorage.getItem("token") != '') {
        //   this.infoUsuario = jwt_decode(sessionStorage.getItem('token'));
        //   this.utilservice.alertConfirmMini('success', `Bienvenido al FONA ${this.infoUsuario.Usuario[0].Nombres} ${this.infoUsuario.Usuario[0].Apellidos}`);
        //   this._router.navigate(['home']).then(() => {window.location.reload()});
        //   return;
        // } else {
        //   this.utilservice.alertConfirmMini('error', 'Errorr');
        // }
      },
      (error) => {
        this.loading = false;
        // this._router.navigate(['login'])
        sessionStorage.clear();
        localStorage.clear();  
        this.utilservice.alertConfirmMini('error','Verifique los datos, e intente nuevamente')
      }
    );
  }




  async Certificado(id: string){
    this.xAPI.funcion = "RECOSUP_R_Certificados";
    this.xAPI.parametros = id
     await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length != 0) {
          this.Qr = ''
          console.log(data.Cuerpo[0])
          var cert = data.Cuerpo[0]
          Swal.fire({
            html: `
                  <div class="card card-congratulations">
                    <div class="card-body text-center">
                      <div class="avatar avatar-xl bg-primary shadow">
                      </div>
                      <div class="text-center">
                        <h1 class="mb-1 text-white">${cert.razon_social}</h1>
                        <p class="card-text m-auto w-50">
                        RIF: ${cert.rif}
                        </p>
                        <p class="card-text m-auto w-100">
                        DIRECCI??N: ${cert.direccion}
                        </p>
                        <p class="card-text m-auto w-75">
                        ${cert.correo_empresa}  | ${cert.web}
                        </p>
                      </div>
                      <br>
                      <p align="right">
                      ${this.utilservice.FechaMoment(cert.fecha)}
                      </p>
                    </div>
                  </div>
            `,
            footer: `
                      <div class="auth-footer-btn d-flex justify-content-center">
                          <p class="text-center mt-2">
                            <small align="center">
                            <strong>Fondo Nacional Antidrogas - RIF: G-20009057-0</strong>
                            <br>Av. Francisco de Miranda, Edif. Centro Empresarial Metropolitano de Automoviles 407, PB. Oficina FONA, Los Ruices.
                           <br> E-MAIL:  <a href="mailto:recaudacion_fona@fona.gob.ve">recaudacion_fona@fona.gob.ve</a> - <a href="mailto:recaudacion_fona@fona.gob.ve">soporteypagos3234@gmail.com</a>
                            TELF: <a href="Tel:02122329541">0212-2329541 / 2697 / 5522 </a> Ext: 8270-8271 
                            </small>
                            </p>
                      </div>
            `,
            icon: 'success',
            width: '900px',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#3085d6',
          })
         } else {
          this.Qr = ''
          Swal.fire({
            title: 'Certificado NO Valido!',
            text: 'Lo sentimos, este certificado no es generado por nuestro sistema.',
            icon: 'error',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
          })
         } 
      },
      (error) => {
        console.log(error)
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
