import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '@core/services/pdf/pdf.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { IDeclararUtilidad, IRECOSUP_C_Proyectos } from '@core/services/empresa/empresa.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import Spanish from 'flatpickr/dist/l10n/es.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';

import {
  I18n,
  CustomDatepickerI18n
} from '@core/services/util/datapicker.service';
import { CoreConfigService } from '@core/services/config.service';

@Component({
  selector: 'app-company-projects',
  templateUrl: './company-projects.component.html',
  styleUrls: ['./company-projects.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, NgbModalConfig, NgbModal] // define custom NgbDatepickerI18n provider

})
export class CompanyProjectsComponent implements OnInit {


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public CrearProyecto: IRECOSUP_C_Proyectos = {
    id_empresa: 0,
    id_analista: 0,
    status_proyecto: 0,
    nombre_proyecto: '',
    fecha_proyecto: '',
    monto_inversion: '',
    direccion: '',
    tiempo_ejecucion_desde: '',
    tiempo_ejecucion_hasta: '',
    UsuarioCreo: 0,
    UsuarioModifico: 0,
    monto_financiamiento: '0',
    Asesor_Nombre: '',
    Asesor_Rif: '',
    Asesor_Telefono: '',
    Asesor_Correo: '',
    Asesor_Representante: '',
    nombre_empresa: '',
    rif_empresa: '',
    estado: undefined,
    parroquia: undefined,
    municipio: undefined
  }

  public Details = {
    id_empresa: 0,
    id_analista: 0,
    status_proyecto: 0,
    nombre_proyecto: '',
    ambito_nombre: '',
    area_proyecto: '',
    estado: undefined,
    municipio: undefined,
    parroquia: undefined,
    fecha_proyecto: '',
    monto_inversion: '',
    beneficiario_directos: '',
    beneficiario_indirectos: '',
    direccion: '',
    tiempo_ejecucion_desde: '',
    tiempo_ejecucion_hasta: '',
    UsuarioCreo: 0,
    UsuarioModifico: 0
  }

  public añoActual = new Date()
  public DatepickerYear = this.añoActual.getFullYear()
  public DatepickerMonth = this.añoActual.getMonth()


  public rowsProyectos = []
  public MisProjects = [];

  public color

  public token

  // Fecha Actual
  public fechaActual = new Date();

  public IdEmpresa
  // public
  public data: any;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;

  public searchValue = '';

  public ButtonShow = false;



  // decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  public rows;
  public tempFilterData;
  public previousStatusFilter = '';

  private tempDataMisProjects = [];

  private tempDataDetalleAporte = []
  public rowsDataDetalleAporte = []

  public loginForm: FormGroup;


  public Estados = []
  public Municipios = []
  public Parroquias = []
  public Ambito = []
  public Area = []

  public fecha_proyecto
  public tiempo_ejecucion_desde
  public tiempo_ejecucion_hasta

  public selectEstados
  public selectMunicipios
  public selectParroquias


  public titleModal
  public showBtn: boolean = true

  constructor(
    private utilService: UtilService,
    private _router: Router,
    private datePipe: DatePipe,
    private apiService: ApiService,
    private modalService: NgbModal,
    private pdf: PdfService,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private _coreConfigService: CoreConfigService,
  ) {
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'))
    // console.log(this.token)
    this.IdEmpresa = this.token.Usuario[0].EmpresaId
    if (this.IdEmpresa != null) {
      this.ButtonShow = true
      await this.EmpresaRIF(this.token.Usuario[0].Rif)
      await this.MisProyectos(this.IdEmpresa)
      await this.ListaEstados()
      await this.SelectAmbito()
      await this.SelectArea()
    } else {
      this.ButtonShow = false
    }
  }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "RECOSUP_R_empresa_rif";
    this.xAPI.parametros = id
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // console.log(e)
          this.CrearProyecto.nombre_empresa = e.RazonSocial
          this.CrearProyecto.rif_empresa = e.Rif
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async MisProyectos(id: any) {
    this.xAPI.funcion = "RECOSUP_R_Proyectos_ID_Empresa";
    this.xAPI.parametros = id
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // console.log(e)
          e.contactos = JSON.parse(e.contactos)
          e.monto_inversionX = e.monto_inversion
          e.monto_inversion = this.utilService.ConvertirMoneda(e.monto_inversion)
          this.MisProjects.push(e)
        });
        // console.log(this.MisProjects)
        this.rowsProyectos = this.MisProjects;
        this.tempDataMisProjects = this.rowsProyectos;
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaEstados() {
    this.xAPI.funcion = "RECOSUP_R_Estados";
    this.selectEstados = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectEstados = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.EstadoId
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaMunicipios(row: string) {
    if (row != null) {
      this.xAPI.funcion = "RECOSUP_R_Municipios";
      this.xAPI.parametros = row['EstadoId'];
      this.selectMunicipios = []
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.selectMunicipios = data.Cuerpo.map(e => {
            e.name = e.Nombre
            e.id = e.MunicipioId
            return e
          });
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }

  ListaParroquias(row: string) {
    if (row != null) {
      this.xAPI.funcion = "RECOSUP_R_Parroquias_ID";
      this.xAPI.parametros = row['MunicipioId'];
      this.selectParroquias = []
      this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          // console.log(data.Cuerpo)
          this.selectParroquias = data.Cuerpo.map(e => {
            e.name = e.Nombre
            e.id = e.ParroquiaId
            return e
          });
          // console.log(this.selectParroquias)
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }

  async SelectAmbito() {
    this.xAPI.funcion = "RECOSUP_R_Proyecto_Ambito";
    this.xAPI.parametros = ""
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.Nombre === 'PL') {
            e.id = e.TipoProyectoId
            e.name = '(' + e.Nombre + ')' + ' | ' + e.Descripcion
            this.Ambito.push(e)
          }
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async SelectArea() {
    this.xAPI.funcion = "RECOSUP_R_Proyecto_Area";
    this.xAPI.parametros = ""
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.id_area == 6) {
            e.id = e.id_area
            e.name = e.nombre_area
            this.Area.push(e)
          }
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async onSubmit() {

    this.CrearProyecto.estado = this.CrearProyecto.estado.Codigo
    this.CrearProyecto.municipio = this.CrearProyecto.municipio.Codigo
    this.CrearProyecto.parroquia = this.CrearProyecto.parroquia.ParroquiaId
    this.CrearProyecto.id_empresa = this.IdEmpresa
    this.CrearProyecto.UsuarioCreo = this.token.Usuario[0].UsuarioId
    // this.CrearProyecto.fecha_proyecto = this.fecha_proyecto.year + '-' + this.fecha_proyecto.month + '-' + this.fecha_proyecto.day,
    // this.CrearProyecto.tiempo_ejecucion_desde = this.tiempo_ejecucion_desde.year + '-' + this.tiempo_ejecucion_desde.month + '-' + this.tiempo_ejecucion_desde.day,
    // this.CrearProyecto.tiempo_ejecucion_hasta = this.tiempo_ejecucion_hasta.year + '-' + this.tiempo_ejecucion_hasta.month + '-' + this.tiempo_ejecucion_hasta.day,
    // console.log(this.CrearProyecto)
    this.xAPI.funcion = "RECOSUP_C_Proyectos";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearProyecto)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsProyectos.push(this.MisProjects)
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilService.alertConfirmMini('success', 'Ganancias Registradas Exitosamente')
          this.MisProjects = []
          this.MisProyectos(this.IdEmpresa)
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Ocurrio un Error')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  ModificarProyecto(modal: any, row: any) {
    // console.log(row)
    this.CrearProyecto.id_proyectos = row.id_proyectos
    this.CrearProyecto.id_empresa = row.id_empresa
    this.CrearProyecto.UsuarioModifico = this.IdEmpresa
    this.CrearProyecto.nombre_proyecto = row.nombre_proyecto
    this.CrearProyecto.fecha_proyecto = row.fecha_proyecto
    this.CrearProyecto.monto_inversion = row.monto_inversionX
    this.CrearProyecto.direccion = row.direccion
    this.CrearProyecto.ambito_proyecto = row.ambito_proyecto
    this.CrearProyecto.area_proyecto = row.area_proyecto
    this.CrearProyecto.estado = row.estado
    this.CrearProyecto.municipio = row.municipio
    this.CrearProyecto.parroquia = row.parroquia
    this.CrearProyecto.tiempo_ejecucion_desde = row.tiempo_ejecucion_desde
    this.CrearProyecto.tiempo_ejecucion_hasta = row.tiempo_ejecucion_hasta
    this.CrearProyecto.area_proyecto = row.area_proyecto
    this.CrearProyecto.beneficiario_directos = row.beneficiario_directos
    this.CrearProyecto.beneficiario_indirectos = row.beneficiario_indirectos
    this.CrearProyecto.Asesor_Nombre = row.Asesor_Nombre
    this.CrearProyecto.Asesor_Rif = row.Asesor_Rif
    this.CrearProyecto.Asesor_Telefono = row.Asesor_Telefono
    this.CrearProyecto.Asesor_Correo = row.Asesor_Correo
    this.CrearProyecto.Asesor_Representante = row.Asesor_Representante

    this.titleModal = 'Actualización de Proyectos'
    this.showBtn = false
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  DownloadFichaResumen(data: any) {
    // console.log(data)
    this.pdf.GenerarFichaResumenProyectoLaboral(data, '')
    this.utilService.alertConfirmMini('success', 'Tu archivo ha sido cargado con exito')
  }


  async DeleteMisProjects(data: any) {
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
        this.xAPI.funcion = "RECOSUP_D_Proyectos";
        this.xAPI.parametros = data.id_proyectos
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.rowsProyectos.push(this.MisProjects)
            // console.log(data)
            if (data.tipo === 1) {
              this.MisProjects = []
              this.MisProyectos(this.IdEmpresa)
              this.utilService.alertConfirmMini('success', 'Registro Eliminado Exitosamente')
            } else {
              this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
  }

  async DetailsProject(id: any) {
    this.xAPI.funcion = "RECOSUP_R_Proyectos_ID";
    this.xAPI.parametros = id.id_proyectos
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.Details.nombre_proyecto = e.nombre_proyecto
          this.Details.fecha_proyecto = e.fecha_proyecto
          this.Details.monto_inversion = this.utilService.ConvertirMoneda(e.monto_inversion)
          this.Details.ambito_nombre = '(' + e.ambito_nombre + ') |  ' + e.ambito_descripcion
          this.Details.area_proyecto = e.nombre_area
          this.Details.estado = e.estado
          switch (e.status_proyecto) {
            case '0':
              this.color = 'warning'
              e.status_proyecto = 'Revisión'
              break;
            case '1':
              this.color = 'success'
              e.status_proyecto = 'Aprobado'
              break;
            case '2':
              this.color = 'danger'
              e.status_proyecto = 'Rechazado'
              break;
            default:
              break;
          }
          this.Details.status_proyecto = e.status_proyecto
          this.Details.municipio = e.municipio
          this.Details.parroquia = e.parroquia
          this.Details.beneficiario_directos = e.beneficiario_directos
          this.Details.beneficiario_indirectos = e.beneficiario_indirectos
          this.Details.tiempo_ejecucion_desde = e.tiempo_ejecucion_desde
          this.Details.tiempo_ejecucion_hasta = e.tiempo_ejecucion_hasta
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async UpdateProyect() {
    this.CrearProyecto.estado = this.CrearProyecto.estado.Codigo
    this.CrearProyecto.municipio = this.CrearProyecto.municipio.Codigo
    this.CrearProyecto.parroquia = this.CrearProyecto.parroquia.ParroquiaId

    this.xAPI.funcion = "RECOSUP_U_ProyectosUpdate";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearProyecto)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsProyectos.push(this.MisProjects)
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilService.alertConfirmMini('success', 'Registro Actualizado Exitosamente')
          this.MisProjects = []
          this.MisProyectos(this.IdEmpresa)
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Ocurrio un Error')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  /**
 * filterUpdate
 *
 * @param event
 */
  filterUpdateMisProjects(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataMisProjects.filter(function (d) {
      return d.nombre_proyecto.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsProyectos = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }



  AddRegister(modal) {
    this.titleModal = 'Registro de Proyectos'
    this.showBtn = true
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  DetalleModal(modal, data) {
    this.DetailsProject(data)
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }



}

