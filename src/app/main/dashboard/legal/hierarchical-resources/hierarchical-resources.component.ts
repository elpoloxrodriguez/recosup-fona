import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RECOSUP_U_UsuariosStatus, RecursosJerarquicos } from '@core/services/empresa/empresa.service';
import { UtilService } from '@core/services/util/util.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hierarchical-resources',
  templateUrl: './hierarchical-resources.component.html',
  styleUrls: ['./hierarchical-resources.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class HierarchicalResourcesComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public IRecursoJerarquico: RecursosJerarquicos = {
    nombre_empresa: '',
    rif: '',
    nomenclatura: '',
    fecha_interposicion: undefined,
    fecha_notificacion: undefined,
    status: undefined,
    fecha_registro: undefined,
    observacion: '',
    lapso_aprobatorio_fecha_desde: undefined,
    lapso_aprobatorio_fecha_hasta: undefined,
    user_created: 0,
    lapso_aprobatorio: undefined
  }

  public ListaLapsoAprobatorio = [
    { id: 1, name: 'Aplica' },
    { id: 0, name: 'No Aplica' }
  ]

  public token: any

  public ModalTitle
  public ShowBtn: boolean = true
  public TitleBtn
  public dataListRecursosJerarquicos = [];
  public dataEmpresaDocumentosAdjuntos = []
  public sidebarToggleRef = false;
  public rowsRecursosJerarquicos;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];


  public isLoading: number = 0;

  public searchValue = '';




  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;


  // Private
  private tempDataRecursosJerarquicos = [];
  private _unsubscribeAll: Subject<any>;

  //  Public
  public dataUser

  public show: boolean = true

  public ListaStastus = [
    { id: 1, name: 'Con Lugar' },
    { id: 2, name: 'Sin Lugar' },
    { id: 3, name: 'Parcialmente con Lugar' },
    { id: 4, name: 'En Evaluación' }
  ]

  public id_user

  public formattedDate: string;
  public fecha = new Date('2024-01-14')

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private datePipe: DatePipe
  ) {
    this._unsubscribeAll = new Subject();
  }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.id_user = this.token.Usuario[0].UsuarioId
    // console.log(this.id_user);
    await this.ListRecursosJerarquicos()

  }

  async ListRecursosJerarquicos() {
    this.xAPI.funcion = "RECOSUP_R_Recurso_Jerarquico";
    this.xAPI.parametros = '';
    this.xAPI.valores = {}
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            this.dataListRecursosJerarquicos.push(e)
          });
          this.rowsRecursosJerarquicos = this.dataListRecursosJerarquicos;
          this.tempDataRecursosJerarquicos = this.rowsRecursosJerarquicos;
          // console.log(this.rowsRecursosJerarquicos)
          this.isLoading = 1;
        } else {
          this.isLoading = 2;
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  captureLapso(event: any) {
    if (event == 1) {
      this.show = false
    } else {
      this.show = true
    }
  }

  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataRecursosJerarquicos.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsRecursosJerarquicos = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  async AgregarRecursosJerarquicos() {
    this.IRecursoJerarquico.user_created = this.id_user
    this.IRecursoJerarquico.lapso_aprobatorio_fecha_desde ? this.IRecursoJerarquico.lapso_aprobatorio_fecha_desde : '00-00-0000'
    this.IRecursoJerarquico.lapso_aprobatorio_fecha_hasta ? this.IRecursoJerarquico.lapso_aprobatorio_fecha_hasta : '00-00-0000'

    this.xAPI.funcion = "RECOSUP_C_Recurso_Jerarquico";
    this.xAPI.parametros = '';
    this.xAPI.valores = JSON.stringify(this.IRecursoJerarquico)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.dataListRecursosJerarquicos = []
          this.rowsRecursosJerarquicos = []
          this.ListRecursosJerarquicos()
          this.Limpiar()
          this.modalService.dismissAll()
          this.utilService.alertConfirmMini('success', 'Recurso Jerarquico Registrado!')
        } else {
          this.utilService.alertConfirmMini('error', 'Oops algo salio mal!, Porfavor verifique e intente nuevamente.')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ModificarRecursosJerarquicos() {
    this.xAPI.funcion = "RECOSUP_U_Recurso_Jerarquico";
    this.xAPI.parametros = '';
    this.xAPI.valores = JSON.stringify(this.IRecursoJerarquico)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo == 1) {
          this.dataListRecursosJerarquicos = []
          this.rowsRecursosJerarquicos = []
          this.ListRecursosJerarquicos()
          this.Limpiar()
          this.modalService.dismissAll()
          this.utilService.alertConfirmMini('success', 'Recurso Jerarquico Actualizado!')
        } else {
          this.utilService.alertConfirmMini('error', 'Oops algo salio mal!, Porfavor verifique e intente nuevamente.')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async EliminarRJ(data: any) {
    Swal.fire({
      title: 'Esta Seguro de Eliminar?',
      html: `<strong>Recurso Jerarquico: <font color="red">${data.nombre_empresa}</font> </strong> <br> tenga en cuenta que el registro se eliminara de la Base de Datos`,
      icon: 'warning',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminarlo!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.xAPI.funcion = 'RECOSUP_D_RecursoJerarquico'
        this.xAPI.parametros = data.id_rj
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.rowsRecursosJerarquicos.push(this.dataListRecursosJerarquicos)
            if (data.tipo === 1) {
              this.dataListRecursosJerarquicos = []
              this.ListRecursosJerarquicos()
              // this._router.navigate(['/support/users-status']).then(() => {window.location.reload()});
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
                title: 'Recurso Jerarquico Eliminado!'
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

  CrearRJ(modal: any) {
    this.ModalTitle = 'Agregar Nuevo Recurso Jerarquico'
    this.ShowBtn = false
    this.TitleBtn = 'Agregar Recurso Jerarquico'
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ModalUpdateRJ(modal: any, row: any) {
    this.IRecursoJerarquico.id_rj = row.id_rj
    this.IRecursoJerarquico.user_created = this.id_user
    this.IRecursoJerarquico.nombre_empresa = row.nombre_empresa
    this.IRecursoJerarquico.rif = row.rif
    this.IRecursoJerarquico.nomenclatura = row.nomenclatura
    this.IRecursoJerarquico.fecha_interposicion = row.fecha_interposicion
    this.IRecursoJerarquico.fecha_notificacion = row.fecha_notificacion
    this.IRecursoJerarquico.status = parseInt(row.status)
    this.IRecursoJerarquico.fecha_registro = row.fecha_registro
    this.IRecursoJerarquico.observacion = row.observacion
    this.IRecursoJerarquico.lapso_aprobatorio = parseInt(row.lapso_aprobatorio)
    this.IRecursoJerarquico.lapso_aprobatorio_fecha_desde = row.lapso_aprobatorio_fecha_desde
    this.IRecursoJerarquico.lapso_aprobatorio_fecha_hasta = row.lapso_aprobatorio_fecha_hasta
    this.IRecursoJerarquico.user_created = this.id_user
    this.ModalTitle = 'Actualizar Nuevo Recurso Jerarquico'
    this.ShowBtn = true
    this.TitleBtn = 'Actualizar Recurso Jerarquico'
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  Limpiar() {
    this.IRecursoJerarquico = {
      nombre_empresa: '',
      rif: '',
      nomenclatura: '',
      fecha_interposicion: undefined,
      fecha_notificacion: undefined,
      status: undefined,
      fecha_registro: undefined,
      observacion: '',
      lapso_aprobatorio_fecha_desde: undefined,
      lapso_aprobatorio_fecha_hasta: undefined,
      user_created: 0,
      lapso_aprobatorio: undefined
    }
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



