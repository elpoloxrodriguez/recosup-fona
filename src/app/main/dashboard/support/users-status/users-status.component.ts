import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RECOSUP_U_UsuariosStatus } from '@core/services/empresa/empresa.service';
import { UtilService } from '@core/services/util/util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-status',
  templateUrl: './users-status.component.html',
  styleUrls: ['./users-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],

})
export class UsersStatusComponent implements OnInit {
  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IUpdateUsers: RECOSUP_U_UsuariosStatus = {
    Nombres: '',
    Apellidos: '',
    Codigo: '',
    Cedula: '',
    CorreoPrincipal: '',
    CorreoSecundario: '',
    Cargo: '',
    EsAdministrador: 0,
    Estatus: 0,
    UsuarioModifico: 0,
    UsuarioId: 0
  }

  public token: any

  public ModalTitle
  public dataListUsers = [];
  public dataEmpresaDocumentosAdjuntos = []
  public sidebarToggleRef = false;
  public rowsUsuariosInactivos;
  public rows
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';


  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: FormGroup;
  public submitted = false;



  public searchValue = '';




  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;


  // Private
  private tempDataUsuariosInactivos = [];
  private _unsubscribeAll: Subject<any>;

  //  Public
  public dataUser

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private utilService: UtilService,
    private _router: Router 
  ) {
    this._unsubscribeAll = new Subject();
  }

  async ngOnInit() {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    this.token = jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token);
    await this.ListUsuarios()

  }

  async ListUsuarios() {
    this.xAPI.funcion = "RECOSUP_R_UsuariosStatus";
    this.xAPI.parametros = '0';
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          console.log(e);
          this.dataListUsers.push(e)
        });
        this.rowsUsuariosInactivos = this.dataListUsers;
        this.tempDataUsuariosInactivos = this.rowsUsuariosInactivos;
      },
      (error) => {
        console.log(error)
      }
    )
  }


  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataUsuariosInactivos.filter(function (d) {
      return d.Codigo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsUsuariosInactivos = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


  async ActivarUsuario(data: any) {
    this.IUpdateUsers.Nombres = data.Nombres
    this.IUpdateUsers.Apellidos = data.Apellidos
    this.IUpdateUsers.Codigo = data.Codigo
    this.IUpdateUsers.Cedula = data.Cedula
    this.IUpdateUsers.CorreoPrincipal = data.CorreoPrincipal
    this.IUpdateUsers.CorreoSecundario = data.CorreoSecundario
    this.IUpdateUsers.Cargo = data.Cargo
    this.IUpdateUsers.EsAdministrador = data.EsAdministrador
    this.IUpdateUsers.Estatus = 1
    this.IUpdateUsers.UsuarioModifico = this.token.Usuario[0].UsuarioId
    this.IUpdateUsers.UsuarioId = data.UsuarioId
    Swal.fire({
      title: 'Esta Seguro de Activarlo?',
      html: `<strong>Usuario: <font color="red">${data.Codigo}</font> </strong>`,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Activarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = 'RECOSUP_U_UsuariosStatus'
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IUpdateUsers)
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // this.rowsUsuariosInactivos.push(this.dataListUsers)
            if (data.tipo === 1) {
              // this.dataListUsers = []
              // this.ListUsuarios()
              this._router.navigate(['/support/users-status']).then(() => {window.location.reload()});
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'success',
                title: 'Usuario Activado Exitosamente'
              })
            } else {
              this.utilService.alertConfirmMini('error', 'Oops algo salio mal!, Porfavor verifique e intente nuevamente.')
            }
          },
          (error) => {
            console.error(error)
          }
        )
      }
    })
  }

  async RechazarUsuario(data: any) {
    this.IUpdateUsers.Nombres = data.Nombres
    this.IUpdateUsers.Apellidos = data.Apellidos
    this.IUpdateUsers.Codigo = data.Codigo
    this.IUpdateUsers.Cedula = data.Cedula
    this.IUpdateUsers.CorreoPrincipal = data.CorreoPrincipal
    this.IUpdateUsers.CorreoSecundario = data.CorreoSecundario
    this.IUpdateUsers.Cargo = data.Cargo
    this.IUpdateUsers.EsAdministrador = data.EsAdministrador
    this.IUpdateUsers.Estatus = 2
    this.IUpdateUsers.UsuarioModifico = this.token.Usuario[0].UsuarioId
    this.IUpdateUsers.UsuarioId = data.UsuarioId
    Swal.fire({
      title: 'Esta Seguro de Rechazarlo?',
      html: `<strong>Usuario: <font color="red">${data.Codigo}</font> </strong>`,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Rechazarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = 'RECOSUP_U_UsuariosStatus'
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.IUpdateUsers)
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // this.rowsUsuariosInactivos.push(this.dataListUsers)
            if (data.tipo === 1) {
              // this.dataListUsers = []
              // this.ListUsuarios()
              this._router.navigate(['/support/users-status']).then(() => {window.location.reload()});
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              Toast.fire({
                icon: 'success',
                title: 'Usuario Rechazado Exitosamente'
              })
            } else {
              this.utilService.alertConfirmMini('error', 'Oops algo salio mal!, Porfavor verifique e intente nuevamente.')
            }
          },
          (error) => {
            console.error(error)
          }
        )
      }
    })
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


