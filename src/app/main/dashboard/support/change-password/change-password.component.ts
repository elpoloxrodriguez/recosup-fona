import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

export interface RECOSUP_U_PasswordUsers {
	empresa	 ?:	number
	clave	 ?:	string
}


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})

export class ChangePasswordComponent implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public token : any

  public ModalTitle
  public dataListUsuarios = [];
  public dataEmpresaDocumentosAdjuntos = []
  public sidebarToggleRef = false;
  public rowsEmpresasAportes;
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
  private tempDataEmpresasAportes = [];
  private _unsubscribeAll: Subject<any>;

//  Public
public dataUser

  constructor(
    private apiService : ApiService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) { 
    this._unsubscribeAll = new Subject();
  }

  async ngOnInit() {
    this.resetPasswordForm = this._formBuilder.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    this.token =  jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token);
    await this.ListUsuarios()
    
  }

  async ListUsuarios() {
    this.xAPI.funcion = "RECOSUP_R_ListUsers";
    this.xAPI.parametros = '';
    this.dataListUsuarios = []
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // data.Cuerpo.map(e => {
        //   this.dataListUsuarios.push(e);
        //   setTimeout(() => {
            this.rowsEmpresasAportes = data.Cuerpo;
            this.tempDataEmpresasAportes = this.rowsEmpresasAportes;
        // }, 450);
        // });
        // console.log(data.Cuerpo)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  ChangePassword(){
    let clave = this.resetPasswordForm.value.newPassword
    let usuario = this.dataUser
    this.ChangePasswordUsers(usuario,clave)
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

  async ChangePasswordUsers(usuario: any, clave: any){
  
  let datos = {
    usuario: usuario,
	  clave:  clave
  }
  this.xAPI.funcion = 'RECOSUP_U_PasswordUsers'
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
    const temp = this.tempDataEmpresasAportes.filter(function (d) {
      return d.Rif.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsEmpresasAportes = temp;
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
  

  /**
   * On destroy
   */
   ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}
