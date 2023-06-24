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
  encapsulation : ViewEncapsulation.None,
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, NgbModalConfig, NgbModal] // define custom NgbDatepickerI18n provider

})
export class CompanyProjectsComponent implements OnInit {


  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public CrearProyecto : IRECOSUP_C_Proyectos = {
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
    monto_financiamiento: '0'
  }

  public Details = {
    id_empresa: 0,
    id_analista: 0,
    status_proyecto: 0,
    nombre_proyecto: '',
    ambito_nombre: '',
    area_proyecto: '',
    estado: '',
    municipio: '',
    parroquia: '',
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
    public rowsDataDetalleAporte= []

  public loginForm: FormGroup;


    public Estados = []
    public Municipios = [] 
    public Parroquias = [] 
    public Ambito = []
    public Area = []

    public fecha_proyecto
    public tiempo_ejecucion_desde
    public tiempo_ejecucion_hasta

  constructor(
    private utilService : UtilService,
    private _router: Router,
    private datePipe: DatePipe,
    private apiService : ApiService,
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
   async ngOnInit()  {
    this.token =  jwt_decode(sessionStorage.getItem('token'))
    this.IdEmpresa = this.token.Usuario[0].EmpresaId

    if (this.IdEmpresa != null) {
      this.ButtonShow = true
      await this.MisProyectos(this.IdEmpresa)
      await this.SelectEstados()
      await this.SelectAmbito()
      await this.SelectArea()
    } else {
      this.ButtonShow = false
    }
   }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------


  async MisProyectos(id: any) {
    this.xAPI.funcion = "RECOSUP_R_Proyectos_ID_Empresa";
    this.xAPI.parametros = id
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // console.log(e)
          e.monto_inversionX = e.monto_inversion
          e.monto_inversion = this.utilService.ConvertirMoneda(e.monto_inversion)
           this.MisProjects.push(e)
          });
          this.rowsProyectos = this.MisProjects;
          this.tempDataMisProjects = this.rowsProyectos;
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async SelectEstados() {
    this.xAPI.funcion = "RECOSUP_R_Estados";
    this.xAPI.parametros =""
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.id = e.EstadoId,
          e.name = e.Nombre
          this.Estados.push(e)
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async SelectMunicipio(id : any) {
    this.xAPI.funcion = "RECOSUP_R_Municipios";
    this.xAPI.parametros = id
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.Municipios = data.Cuerpo.map(e => {
          e.id = e.EstadoId,
          e.name = e.Nombre
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async SelectParroquias(id : any) {
    this.xAPI.funcion = "RECOSUP_R_Parroquias_ID";
    this.xAPI.parametros = id
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.Parroquias = data.Cuerpo.map(e => {
          e.id = e.ParroquiaId,
          e.name = e.Nombre
         return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
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
            e.name =  '('+e.Nombre+')'+ ' | ' +e.Descripcion
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
          e.id = e.id_area
          e.name = e.nombre_area
          this.Area.push(e)
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async onSubmit(){
    this.CrearProyecto.id_empresa = this.IdEmpresa
    this.CrearProyecto.UsuarioCreo =  this.token.Usuario[0].UsuarioId
    this.CrearProyecto.fecha_proyecto =  this.fecha_proyecto.year+'-'+this.fecha_proyecto.month+'-'+this.fecha_proyecto.day,
    this.CrearProyecto.tiempo_ejecucion_desde = this.tiempo_ejecucion_desde.year+'-'+this.tiempo_ejecucion_desde.month+'-'+this.tiempo_ejecucion_desde.day,
    this.CrearProyecto.tiempo_ejecucion_hasta = this.tiempo_ejecucion_hasta.year+'-'+this.tiempo_ejecucion_hasta.month+'-'+this.tiempo_ejecucion_hasta.day,
    console.log(this.CrearProyecto)
    this.xAPI.funcion = "RECOSUP_C_Proyectos";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearProyecto)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsProyectos.push(this.MisProjects)
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilService.alertConfirmMini('success','Ganancias Registradas Exitosamente') 
          this.MisProjects = []
          this.MisProyectos(this.IdEmpresa)
        } else {
          this.utilService.alertConfirmMini('error','Oops! Ocurrio un Error') 
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DownloadFichaResumen(data: any){
    console.log(data)
    this.pdf.GenerarFichaResumenProyectoLaboral(data)
    this.utilService.alertConfirmMini('success', 'Tu archivo ha sido cargado con exito')
  }


  async DeleteMisProjects(data: any){
  await  Swal.fire({
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
              this.utilService.alertConfirmMini('success','Registro Eliminado Exitosamente')
            } else {
              this.utilService.alertConfirmMini('error','Lo sentimos algo salio mal, intente de nuevo')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
  }

  async DetailsProject(id: any){
  this.xAPI.funcion = "RECOSUP_R_Proyectos_ID";
  this.xAPI.parametros = id.id_proyectos
  this.xAPI.valores = ""
  await this.apiService.Ejecutar(this.xAPI).subscribe(
    (data) => {
      data.Cuerpo.map(e => {
         this.Details.nombre_proyecto = e.nombre_proyecto
         this.Details.fecha_proyecto = e.fecha_proyecto
         this.Details.monto_inversion = this.utilService.ConvertirMoneda(e.monto_inversion)
         this.Details.ambito_nombre = '('+e.ambito_nombre +') |  '+ e.ambito_descripcion
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
      this.modalService.open(modal,{
        centered: true,
        size: 'lg',
        backdrop: false,
        keyboard: false,
        windowClass: 'fondo-modal',
      });
    }

    DetalleModal(modal, data){
      this.DetailsProject(data)
      this.modalService.open(modal,{
        centered: true,
        size: 'lg',
        backdrop: false,
        keyboard: false,
        windowClass: 'fondo-modal',
      });
    }
  


}

