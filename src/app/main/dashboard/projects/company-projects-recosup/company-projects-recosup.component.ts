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
import { IDeclararUtilidad, IRECOSUP_C_Proyectos, RECOSUP_U_ProyectosUpdate } from '@core/services/empresa/empresa.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import Spanish from 'flatpickr/dist/l10n/es.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {
  I18n,
  CustomDatepickerI18n
} from '@core/services/util/datapicker.service';
import { CoreConfigService } from '@core/services/config.service';
import { ConvertNumberService } from '@core/services/util/convert-number.service';


@Component({
  selector: 'app-company-projects-recosup',
  templateUrl: './company-projects-recosup.component.html',
  styleUrls: ['./company-projects-recosup.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, NgbModalConfig, NgbModal] // define custom NgbDatepickerI18n provider
})
export class CompanyProjectsRecosupComponent implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public IUpdateProjects : RECOSUP_U_ProyectosUpdate = {
    id_empresa: 0,
    id_analista: 0,
    status_proyecto: 0,
    nombre_proyecto: '',
    ambito_proyecto: 0,
    fecha_proyecto: '',
    monto_inversion: undefined,
    direccion: '',
    estado: 0,
    parroquia: 0,
    municipio: 0,
    area_proyecto: 0,
    beneficiario_directos: '',
    beneficiario_indirectos: '',
    tiempo_ejecucion_desde: '',
    tiempo_ejecucion_hasta: '',
    UsuarioModifico: 0,
    id_proyectos: 0,
    observacion: ''
  }

  public CrearProyecto : IRECOSUP_C_Proyectos = {
    id_empresa: 0,
    id_analista: 0,
    status_proyecto: 0,
    nombre_proyecto: '',
    fecha_proyecto: '',
    monto_inversion: '',
    monto_financiamiento: '0',
    direccion: '',
    tiempo_ejecucion_desde: '',
    tiempo_ejecucion_hasta: '',
    UsuarioCreo: 0,
    UsuarioModifico: 0
  }

public añoActual = new Date()
public DatepickerYear = this.añoActual.getFullYear()
public DatepickerMonth = this.añoActual.getMonth()

public SelectStatus = [
  { id:'0', name:'En Revisión'},
  { id:'1', name:'Aprobado'},
  { id:'2', name:'Rechazado'},
]
  public rowsProyectos = []
  public MisProjects = [];

  public IdUser

  public token

  public color

// Fecha Actual
public fechaActual = new Date();

  public IdEmpresa
    // public
    public data: any;
    public selectedOption = 10;
    public ColumnMode = ColumnMode;
  
    public searchValue = '';
  
    public ButtonShow = false;

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


    public InputFinanciamiento = false
    public BtnShow = true
    public BtnHidden = false

    public InputProyetoLaboral = false

    public selectEstados
    public selectMunicipios
    public selectParroquias

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
    private convertNumberService: ConvertNumberService
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
    this.IdUser = this.token.Usuario[0].UsuarioId
    if (this.IdEmpresa != null) {
      this.ButtonShow = false
    } else {
      this.ButtonShow = true
    }
      await this.MisProyectos()
      await this.SelectAmbito()
      await this.SelectArea()
      await this.ListaEstados()

   }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  SelectAmbitosEvent(event){
    // console.log(event)
    if (event === '2') {
      this.InputProyetoLaboral = true
    } else {
      this.InputProyetoLaboral = false
      this.CrearProyecto.Asesor_Nombre = ''
      this.CrearProyecto.Asesor_Rif = ''
      this.CrearProyecto.Asesor_Telefono = ''
      this.CrearProyecto.Asesor_Correo = ''
      this.CrearProyecto.Asesor_Representante = ''
    }
  }

  async onSubmit(){
    this.CrearProyecto.id_empresa = this.IdEmpresa
    this.CrearProyecto.UsuarioCreo =  this.token.Usuario[0].UsuarioId
    this.CrearProyecto.fecha_proyecto =  this.fecha_proyecto.year+'-'+this.fecha_proyecto.month+'-'+this.fecha_proyecto.day,
    this.CrearProyecto.tiempo_ejecucion_desde = this.tiempo_ejecucion_desde.year+'-'+this.tiempo_ejecucion_desde.month+'-'+this.tiempo_ejecucion_desde.day,
    this.CrearProyecto.tiempo_ejecucion_hasta = this.tiempo_ejecucion_hasta.year+'-'+this.tiempo_ejecucion_hasta.month+'-'+this.tiempo_ejecucion_hasta.day,
    // console.log(this.CrearProyecto)
    this.xAPI.funcion = "RECOSUP_C_Proyectos";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearProyecto)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsProyectos.push(this.MisProjects)
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilService.alertConfirmMini('success','Proyecto Registrado Exitosamente') 
          this.MisProjects = []
          this.MisProyectos()
        } else {
          this.utilService.alertConfirmMini('error','Oops! Ocurrio un Error') 
        }
        // console.log(this.CrearProyecto)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async MisProyectos() {
    this.xAPI.funcion = "RECOSUP_R_Proyectos";
    this.xAPI.parametros =""
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.fecha_proyecto = e.fecha_proyecto
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

  BtnFinanciamiento(data: any){
    if (data === true) {
      this.InputFinanciamiento = true
      this.BtnShow = false
      this.BtnHidden = true
    } else {
      this.CrearProyecto.detalle_financiamiento = ''
      this.CrearProyecto.monto_financiamiento = '0'
      this.InputFinanciamiento = false
      this.BtnShow = true
      this.BtnHidden = false

    }
  }

  async SelectAmbito() {
    this.xAPI.funcion = "RECOSUP_R_Proyecto_Ambito";
    this.xAPI.parametros = ""
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
            e.id = e.TipoProyectoId
            e.name =  '('+e.Nombre+')'+ ' | ' +e.Descripcion
            this.Ambito.push(e)            
        });
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

  async ListaMunicipios(id: string) {
    this.xAPI.funcion = "RECOSUP_R_Municipios";
    this.xAPI.parametros = id;
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

  ListaParroquias(id: string) {
    // console.log(id)
    this.xAPI.funcion = "RECOSUP_R_Parroquias_ID";
    this.xAPI.parametros = id;
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

  
    DescargarPDF(data : any){
      // console.log(data) 
      if (data.ambito_nombre == 'PL') {
        this.pdf.GenerarFichaResumenProyectoLaboral(data)
      } else {
        this.pdf.GenerarFichaResumenProyecto(data)
      }
    }


    async UpdateProyect(){
      this.xAPI.funcion = "RECOSUP_U_ProyectosUpdate";
      this.xAPI.parametros = ''
      this.xAPI.valores = JSON.stringify(this.IUpdateProjects)
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          this.rowsProyectos.push(this.MisProjects)
          if (data.tipo === 1) {
            this.modalService.dismissAll('Close')
            this.utilService.alertConfirmMini('success','Registro Actualizado Exitosamente') 
            this.MisProjects = []
            this.MisProyectos()
          } else {
            this.utilService.alertConfirmMini('error','Oops! Ocurrio un Error') 
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
                  this.MisProyectos()
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
  
    AddRegister(modal) {
      this.modalService.open(modal,{
        centered: true,
        size: 'xl',
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

    ModalUpdateProjects(modal, data){
      // console.log(data)
      this.IUpdateProjects.status_proyecto = data.status_proyecto
      this.IUpdateProjects.observacion = data.observacion
       this.IUpdateProjects.id_empresa = data.id_empresa
       this.IUpdateProjects.id_analista = data.id_analista
       this.IUpdateProjects.nombre_proyecto = data.nombre_proyecto
       this.IUpdateProjects.ambito_proyecto = data.id_ambito
       this.IUpdateProjects.fecha_proyecto = data.fecha_proyecto
       this.IUpdateProjects.monto_inversion = data.monto_inversionX
       this.IUpdateProjects.direccion = data.direccion
       this.IUpdateProjects.estado = data.estadox
       this.IUpdateProjects.parroquia = data.parroquiax
       this.IUpdateProjects.municipio = data.municipiox
       this.IUpdateProjects.area_proyecto = data.id_area
       this.IUpdateProjects.beneficiario_directos = data.beneficiario_directos
       this.IUpdateProjects.beneficiario_indirectos = data.beneficiario_indirectos
       this.IUpdateProjects.tiempo_ejecucion_desde = data.tiempo_ejecucion_desde
       this.IUpdateProjects.tiempo_ejecucion_hasta = data.tiempo_ejecucion_hasta
       this.IUpdateProjects.UsuarioModifico = this.IdUser
       this.IUpdateProjects.id_proyectos = data.id_proyectos
      this.modalService.open(modal,{
        centered: true,
        size: 'lg',
        backdrop: false,
        keyboard: false,
        windowClass: 'fondo-modal',
      });
    }

}


