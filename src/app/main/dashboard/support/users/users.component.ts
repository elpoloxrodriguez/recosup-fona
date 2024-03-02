import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UtilService } from '@core/services/util/util.service';
import { RECOSUP_C_UsuarioAdmin, RECOSUP_U_UsuarioAdmim } from '@core/services/empresa/empresa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],

})
export class UsersComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IUpdateUsuario: RECOSUP_U_UsuarioAdmim = {
    Codigo: '',
    Clave: '',
    Nombres: '',
    Apellidos: '',
    Cedula: '',
    TelefonoLocal: '',
    TelefonoCelular: '',
    CorreoPrincipal: '',
    CorreoSecundario: '',
    Cargo: '',
    EsAdministrador: undefined,
    Estatus: undefined,
    UsuarioModifico: 0,
    UsuarioId: 0
  }

  public ICrearUsuariosAdmin: RECOSUP_C_UsuarioAdmin = {
    Codigo: '',
    Clave: '',
    Nombres: '',
    Apellidos: '',
    Cedula: '',
    TelefonoLocal: '',
    TelefonoCelular: '',
    CorreoPrincipal: '',
    CorreoSecundario: '',
    Cargo: '',
    EsAdministrador: undefined,
    Estatus: undefined,
    UsuarioCreo: 0
  }

  public titleModal: string = ''
  public btnUpdate = false

  public token: any

  public ModalTitle
  public dataListUsuarios = [];
  public dataEmpresaDocumentosAdjuntos = []
  public sidebarToggleRef = false;
  public rowsUsuarios;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public rows
  public ListaUsuarios = []
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public UserId

  public ListaStatus = [
    { id: '1', name: 'Activo' },
    { id: '2', name: 'Inactivo' }
  ]

  public ListaPerfiles = [
    { id: '1', name: 'Recaudación' },
    { id: '2', name: 'Juridico' },
    { id: '3', name: 'Fiscalización' },
    { id: '4', name: 'Proyectos' },
    { id: '9', name: 'Administrador - Tecnologia' },
    { id: '10', name: 'Panel - Estadisticas - Gráficas' }
  ]

  public passwordTextType: boolean;
  public confPasswordTextType: boolean;
  public resetPasswordForm: FormGroup;
  public submitted = false;



  public searchValue = '';




  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;


  // Private
  public tempDataUsuarios = [];
  private _unsubscribeAll: Subject<any>;

  //  Public
  public dataUser

  constructor(
    private utilservice: UtilService,
    private apiService: ApiService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private router: Router
  ) {
    this._unsubscribeAll = new Subject();
  }

  async ngOnInit() {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.UserId = this.token.Usuario[0].UsuarioId
    // console.log(this.token);
    await this.ListUsuarios()

  }

  async ListUsuarios() {
    this.xAPI.funcion = "RECOSUP_R_ListUsers_ADMIN";
    this.xAPI.parametros = '';
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(element => {
          // element.FechaCreo = ''
          this.ListaUsuarios.push(element);
        });
        // console.log(this.ListaUsuarios)
        this.rowsUsuarios = this.ListaUsuarios
        this.tempDataUsuarios = this.rowsUsuarios
      },
      (error) => {
        console.log(error)
      }
    )
  }


  ChangePassword() {
    let clave = this.resetPasswordForm.value.newPassword
    let usuario = this.dataUser
    this.ChangePasswordUsers(usuario, clave)
  }


  ModalDetails(modal, data) {
    this.dataUser = data.UsuarioId
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ChangePasswordUsers(usuario: any, clave: any) {

    let datos = {
      usuario: usuario,
      clave: this.utilservice.md5(clave)
    }
    this.xAPI.funcion = 'RECOSUP_U_PasswordUsers_ADMIN'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(datos)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.info(data)
        this.modalService.dismissAll('Close')
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
          title: 'Contraseña actualizada exitosamente'
        })
      },
      (error) => {
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
          icon: 'error',
          title: error
        })
      }
    )
  }


  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataUsuarios.filter(function (d) {
      return d.Codigo.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsUsuarios = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
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


  CrearUsuario(modal) {
    this.titleModal = 'Registrar Usuario Administrador'
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  UpdateUsuario(modal, data) {
    this.btnUpdate = true
    this.titleModal = 'Actualizar Usuario Administrador'
    // console.log(data);
    this.IUpdateUsuario.UsuarioId = data.UsuarioId
    this.ICrearUsuariosAdmin.Codigo = data.Codigo
    this.ICrearUsuariosAdmin.Clave = data.Clave
    this.ICrearUsuariosAdmin.Nombres = data.Nombres
    this.ICrearUsuariosAdmin.Apellidos = data.Apellidos
    this.ICrearUsuariosAdmin.Cedula = data.Cedula
    this.ICrearUsuariosAdmin.TelefonoLocal = data.TelefonoLocal
    this.ICrearUsuariosAdmin.TelefonoCelular = data.TelefonoCelular
    this.ICrearUsuariosAdmin.CorreoPrincipal = data.CorreoPrincipal
    this.ICrearUsuariosAdmin.CorreoSecundario = data.CorreoSecundario
    this.ICrearUsuariosAdmin.Cargo = data.Cargo
    this.ICrearUsuariosAdmin.EsAdministrador = data.EsAdministrador
    this.ICrearUsuariosAdmin.Estatus = data.Estatus
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async ActualizarUsuarios() {
    this.IUpdateUsuario.Codigo = this.ICrearUsuariosAdmin.Codigo
    this.IUpdateUsuario.Clave = this.ICrearUsuariosAdmin.Clave
    this.IUpdateUsuario.Nombres = this.ICrearUsuariosAdmin.Nombres
    this.IUpdateUsuario.Apellidos = this.ICrearUsuariosAdmin.Apellidos
    this.IUpdateUsuario.Cedula = this.ICrearUsuariosAdmin.Cedula
    this.IUpdateUsuario.TelefonoLocal = this.ICrearUsuariosAdmin.TelefonoLocal
    this.IUpdateUsuario.TelefonoCelular = this.ICrearUsuariosAdmin.TelefonoCelular
    this.IUpdateUsuario.CorreoPrincipal = this.ICrearUsuariosAdmin.CorreoPrincipal
    this.IUpdateUsuario.CorreoSecundario = this.ICrearUsuariosAdmin.CorreoSecundario
    this.IUpdateUsuario.Cargo = this.ICrearUsuariosAdmin.Cargo
    this.IUpdateUsuario.EsAdministrador = this.ICrearUsuariosAdmin.EsAdministrador
    this.IUpdateUsuario.Estatus = this.ICrearUsuariosAdmin.Estatus
    this.xAPI.funcion = "RECOSUP_U_UsuarioAdmim";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.IUpdateUsuario)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsUsuarios.push(this.ListaUsuarios)
        if (data.tipo === 1) {
          this.ListaUsuarios = []
          this.ListUsuarios()
          this.modalService.dismissAll('Close')
          this.utilservice.alertConfirmMini('success', 'Usuario Actualizado Exitosamente!')
          this.router.navigate(['/support/users']).then(() => { window.location.reload() });
        } else {
          this.utilservice.alertConfirmMini('warning', 'Oops, Lo sentimos ocurrio un error, intente de nuevo mas tarde')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }


  async RegistrarUsuarios() {
    this.ICrearUsuariosAdmin.UsuarioCreo = this.UserId
    this.ICrearUsuariosAdmin.Clave = this.utilservice.md5(this.ICrearUsuariosAdmin.Clave)
    this.xAPI.funcion = "RECOSUP_C_UsuarioAdmin";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.ICrearUsuariosAdmin)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsUsuarios.push(this.ListaUsuarios)
        if (data.tipo === 1) {
          this.ListaUsuarios = []
          this.ListUsuarios()
          this.modalService.dismissAll('Close')
          this.utilservice.alertConfirmMini('success', 'Usuario Creado Exitosamente!')
          this.router.navigate(['/support/users']).then(() => { window.location.reload() });
        } else {
          this.utilservice.alertConfirmMini('warning', 'Oops, Lo sentimos ocurrio un error, intente de nuevo mas tarde')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  async DeleteUser(data: any) {
    await Swal.fire({
      title: 'Esta Seguro?',
      text: "De Eliminar Este Registro!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = "RECOSUP_D_UsuarioAdmin";
        this.xAPI.parametros = data.UsuarioId
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.rowsUsuarios = []
            if (data.tipo === 1) {
              this.rowsUsuarios.push(this.ListaUsuarios)
              this.ListaUsuarios = []
              this.ListUsuarios()
              this.utilservice.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
            } else {
              this.utilservice.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
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

