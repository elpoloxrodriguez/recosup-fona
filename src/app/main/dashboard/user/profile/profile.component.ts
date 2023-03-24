import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RECOSUP_U_PasswordUsersID } from '@core/services/empresa/empresa.service';
import { UtilService } from '@core/services/util/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class ProfileComponent implements OnInit {

  public I_CambiarClaveUsuario : RECOSUP_U_PasswordUsersID = {
    Clave: '',
    UsuarioModifico: 0,
    FechaModifico: '',
    UsuarioId: 0,
    Codigo: ''
  }

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public token
  public Rif
  public Codigo
  public NewUser
  public UsuarioId
  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: FormGroup;
  public submitted = false;

  public BtnCambiarClave

public password1
public password2

  constructor(
    private utilService : UtilService,
    private apiService : ApiService,
  ) { }

  ngOnInit(): void {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.BtnCambiarClave = this.token.Usuario[0].EsAdministrador
    this.UsuarioId = this.token.Usuario[0].UsuarioId
    this.Rif = this.token.Usuario[0].Rif
    this.Codigo = this.token.Usuario[0].Codigo
    if (this.token.Usuario[0].Rif != null) {
      this.NewUser = this.Rif
    } else {
      this.NewUser = this.Codigo
    }
  }

      // convenience getter for easy access to form fields
      get f() {
        return this.resetPasswordForm.controls;
      }


      /**
     * Toggle password
     */
      togglePasswordTextType() {
        this.passwordTextType = !this.passwordTextType;
      }
    
      /**
       * Toggle confirm password
       */
      toggleConfPasswordTextType() {
        this.confPasswordTextType = !this.confPasswordTextType;
      }

      async ChangePassword(){
        // console.log(this.password1, this.password2)
        this.I_CambiarClaveUsuario.UsuarioId = this.UsuarioId
        this.I_CambiarClaveUsuario.Codigo = this.NewUser
        this.I_CambiarClaveUsuario.UsuarioModifico = this.UsuarioId
        this.I_CambiarClaveUsuario.FechaModifico = this.utilService.FechaActual()
        this.I_CambiarClaveUsuario.Clave = this.utilService.md5(this.password1),
        this.xAPI.funcion = "RECOSUP_U_PasswordUsersID";
        this.xAPI.valores = JSON.stringify(this.I_CambiarClaveUsuario)
        if (this.password1 === this.password2) {
          await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
             if (data.tipo === 1) {
              this.password1 = ''
              this.password2 = ''
              this.utilService.alertConfirmMini('success', 'Felicidades! Contraseña Actualizada Exitosamente')
             } else {
              this.utilService.alertConfirmMini('error', 'Oops Lo Sentimos! Algo Salio Mal, Verifique e intente nuevamente')
             }
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops Lo Sentimos! Las Contraseñas deben ser iguales')
        }
      }

      async ChangePasswordAdmin(){
        // console.log(this.password1, this.password2)
        this.I_CambiarClaveUsuario.UsuarioId = this.UsuarioId
        this.I_CambiarClaveUsuario.Codigo = this.NewUser
        this.I_CambiarClaveUsuario.UsuarioModifico = this.UsuarioId
        this.I_CambiarClaveUsuario.FechaModifico = this.utilService.FechaActual()
        this.I_CambiarClaveUsuario.Clave = this.utilService.md5(this.password1),
        this.xAPI.funcion = "RECOSUP_U_PasswordUsersAdminID";
        this.xAPI.valores = JSON.stringify(this.I_CambiarClaveUsuario)
        if (this.password1 === this.password2) {
          await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
             if (data.tipo === 1) {
              this.password1 = ''
              this.password2 = ''
              this.utilService.alertConfirmMini('success', 'Felicidades! Contraseña Actualizada Exitosamente')
             } else {
              this.utilService.alertConfirmMini('error', 'Oops Lo Sentimos! Algo Salio Mal, Verifique e intente nuevamente')
             }
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops Lo Sentimos! Las Contraseñas deben ser iguales')
        }
      }

}
