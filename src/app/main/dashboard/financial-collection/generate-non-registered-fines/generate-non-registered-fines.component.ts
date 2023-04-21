import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '@core/services/pdf/pdf.service';
import jwt_decode from "jwt-decode";
import { UtilService } from '@core/services/util/util.service';
import { ICrearCertificados, RECOSUP_C_MultasNuevasMIF, RECOSUP_C_MultasNuevasMIFNoInscritas, RECOSUP_U_AprobarGanancias, RECOSUP_U_PagarAportesConciliar, RECOSUP_U_PagarMultas, RECOSUP_U_PagarMultasEmpresasNoInscritas } from '@core/services/empresa/empresa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generate-non-registered-fines',
  templateUrl: './generate-non-registered-fines.component.html',
  styleUrls: ['./generate-non-registered-fines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class GenerateNonRegisteredFinesComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public xPagarMultas : RECOSUP_U_PagarMultasEmpresasNoInscritas = {
    banco: 0,
    referencia: '',
    status_mif: undefined,
    montoPagado: '',
    Bauche: '',
    Observacion: '',
    fechaPago: '',
    UsuarioModifico: 0,
    id_mif_no_inscri: 0
  }

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }

  public ICrearMultasMIF: RECOSUP_C_MultasNuevasMIFNoInscritas = {
    Rif: '',
    NombreEmpresa: '',
    status_mif: 0,
    Monto_mif: '',
    Nomenclatura_mif: '',
    TipoMultaId: undefined,
    articulo: undefined,
    anio: undefined,
    notificacion: '',
    inicio_fiscal: '',
    cierre_fiscal: '',
    Cuenta_mif: '',
    banco: undefined,
    referencia: '',
    montoPagado: undefined,
    fechaPago: '',
    UsuarioCreo: 0,
    FechaCreo: '',
    UsuarioModifico: 0,
    FechaModifico: ''
  }

  public añoActual = new Date()
  public DatepickerYear = this.añoActual.getFullYear()
  public DatepickerMonth = this.añoActual.getMonth()

  public SelectAnioAporte = []
  public SelectArticulo = []
  public  ActividadEconomicaEmpresa
  public  ListaStatusConciliacionMultas = [
    { id: '1', name: 'Aprobado'},
    { id: '3', name: 'Rechazado'}
  ]

  public rowsDetalleMultasNuevas
  public ListaMultasNuevas = [];
  public tempDataDetalleMultasNuevas = [];

  public rowsUtilidadCierreFiscal
  public Utilidad = [];
  public ListaEmpresas = [];
  public ListaPlanilla = [];
  public rowsDetalleAporte;
  public token

  public montoPagadox

  public EmpresaDetalleMultas
  public MontoModal
  // public
  public data: any;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;

  public searchValue = '';

  public bancoPagoMultas
  public anio
  public articulo
  public inicio_fiscal
  public cierre_fiscal
  public notificacion

  // decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  // private
  private tempData = [];
  private _unsubscribeAll: Subject<any>;
  public rows;
  public tempFilterData;
  public previousStatusFilter = '';

  public rowsDetalleMultas = []
  public tempDataDetalleMultas = []

  public UserId

  public titleModal

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private pdf: PdfService,
    private utilservice: UtilService,
    private router: Router,
    private utilService: UtilService
  ) {
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'))
    this.UserId = this.token.Usuario[0].UsuarioId
    // console.log(this.UserId)
    await this.DetalleMultas()
    await this.DetalleMultasNuevas()
    await this.ListaPlanillas()
    await this.SelecArticulo()
    await this.FuncSelectAnioAporte()
    if (sessionStorage.getItem('Empresas') != undefined) {
      // alert('Ya esta cargada')
      this.ListaEmpresas = JSON.parse(sessionStorage.getItem('Empresas'))
    } else {
      await this.ListaEmpresasSimple()
      // alert('NOO esta cargada')
    }
  }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  FuncSelectAnioAporte() {
    var anioActual = new Date()
    var anio = anioActual.getFullYear()
    for (let index = 2010; index <= anio - 1; index++) {
      this.SelectAnioAporte.push(index)
    }
  }

  async SelecArticulo() {
    this.xAPI.funcion = "RECOSUP_R_Lista_Tipos_Aportes";
    this.xAPI.parametros = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.Codigo == 32 || e.Codigo == 34) {
            e.name = e.Nombre
            e.id = e.Codigo
            this.SelectArticulo.push(e)
          }
        });
        // console.log(this.SelectArticulo)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DetalleMultas() {
    this.xAPI.funcion = "RECOSUP_R_detalle_multas_empresa_Sin_ID";
    this.xAPI.parametros = ""
    this.EmpresaDetalleMultas = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          //  if (e.Anio >= '2021') {
          e.FechaDocumento = this.utilservice.FechaMomentL(e.FechaDocumento)
          e.Monto = this.utilservice.ConvertirMoneda(e.Monto)
          this.EmpresaDetalleMultas.push(e);
          //  }
        });
        this.rowsDetalleMultas = this.EmpresaDetalleMultas;
        this.tempDataDetalleMultas = this.rowsDetalleMultas
      },
      (error) => {
        console.log(error)
      }
    )
  }

   DetalleMultasNuevas() {
    this.ListaMultasNuevas = []
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF_NOINSCRITAS";
    this.xAPI.parametros = ""
     this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.status_mif != '1') {
            e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
            e.Monto = e.Monto_mif
            e.Monto_mif = this.utilservice.ConvertirMoneda(e.Monto_mif)
            this.ListaMultasNuevas.push(e);
          }
        });
        // console.log( this.ListaMultasNuevas)
        this.rowsDetalleMultasNuevas = this.ListaMultasNuevas;
        this.tempDataDetalleMultasNuevas = this.rowsDetalleMultasNuevas
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async GenerarConstancia(datay: any){
    // console.log(datay)
    this.CrearCert.usuario = datay.UsuarioId
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
    this.CrearCert.type = 6, // Certifacion de pago a empresas no inscritas
      this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = "RECOSUP_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://recosup.fona.gob.ve');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  this.pdf.CertificadoPagoMIF_NoInscritas(datay, xdata.contenido, this.CrearCert.token)
                  this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }
  
  async mifAprobadas(){
    this.ListaMultasNuevas = []
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF_NOINSCRITAS";
    this.xAPI.parametros = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.status_mif == '1') {
            e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
            e.Monto_mif = this.utilservice.ConvertirMoneda(e.Monto_mif)
            this.ListaMultasNuevas.push(e);
          }
        });
        // console.log(this.ListaMultasNuevas)
        this.rowsDetalleMultasNuevas = this.ListaMultasNuevas;
        this.tempDataDetalleMultasNuevas = this.rowsDetalleMultasNuevas
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async GenerarPlanillaMIF(dataY: any){
    this.CrearCert.usuario = dataY.id_mif_no_inscri
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
    this.CrearCert.type = 5, // 5 NOTIFICACION DE MIF NO INSCRITAS
      this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = "RECOSUP_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://recosup.fona.gob.ve');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  this.pdf.NotificacionEmpresasNoInscritas(dataY, xdata.contenido, this.CrearCert.token)
                  this.utilService.alertConfirmMini('success', 'Notificación Descagado Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )

  }

  async RegistrarMultasNoIncriptas() {
    // console.log(this.ICrearMultasMIF)
    this.ICrearMultasMIF.status_mif = 0
    this.ICrearMultasMIF.montoPagado = '0'
    this.ICrearMultasMIF.FechaCreo = this.utilService.FechaActual()
    this.ICrearMultasMIF.FechaModifico = this.utilService.FechaActual()
    this.ICrearMultasMIF.UsuarioCreo = this.UserId
    this.xAPI.funcion = "RECOSUP_C_MultasNuevasMIFNoInscritas";
    this.xAPI.parametros = ""
    this.xAPI.valores = JSON.stringify(this.ICrearMultasMIF)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsDetalleMultasNuevas.push(this.ListaMultasNuevas)
        if (data.tipo === 1) {
          this.ListaMultasNuevas = []
          this.DetalleMultasNuevas()
          this.modalService.dismissAll('Close')
          this.router.navigate(['/financial-collection/generate-non-registered-fines']).then(() => { window.location.reload() });
          this.utilservice.alertConfirmMini('success', 'Multa Creada Exitosamente')
        } else {
          this.utilservice.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async ListaEmpresasSimple() {
    this.xAPI.funcion = "RECOSUP_R_Empresas_Simple";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
       data.Cuerpo.map(e => {
          e.name = '(' + e.Rif + ') - ' + e.RazonSocial
          e.id = e.EmpresaId
          // return e
          this.ListaEmpresas.push(e)
        });
        sessionStorage.setItem('Empresas',  JSON.stringify(this.ListaEmpresas));
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaPlanillas() {
    this.ListaPlanilla = []
    this.xAPI.funcion = "RECOSUP_R_ListaPlanillas";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.id_bancos_MIF <=3) {
            e.name = e.nombre_bancos_MIF
          e.id = e.id_bancos_MIF
          this.ListaPlanilla.push(e)
          }
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  filterUpdateMIF(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDetalleMultasNuevas.filter(function (d) {
      return d.NombreEmpresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDetalleMultasNuevas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateMultasViejas(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDetalleMultas.filter(function (d) {
      return d.NombreEmpresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDetalleMultas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  GenerarMultas(modal) {
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }
  
  async DeleteMultasMIF(data: any) {
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
        this.xAPI.funcion = "RECOSUP_D_MultasMIF_NoInscritas";
        this.xAPI.parametros = data.id_mif_no_inscri
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // console.log(data)
            if (data.tipo === 1) {
              this.rowsDetalleMultasNuevas.push(this.ListaMultasNuevas)
              this.ListaMultasNuevas = []
              this.DetalleMultasNuevas()
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

  DetalleModal(modal, data) {
    // console.log(data)
    this.bancoPagoMultas = data.nombre_banco_bancos_MIF +' -  ('+ data.cuenta_bancos_MIF +') - ' + data.nombre_bancos_MIF
    this.MontoModal = data.Monto_mif
    this.xPagarMultas.id_mif_no_inscri = data.id_mif_no_inscri
    this.xPagarMultas.UsuarioModifico = this.UserId
    this.xPagarMultas.banco = data.id_banco
    this.anio = data.anio
    this.articulo = data.articulo
    this.inicio_fiscal = data.inicio_fiscal
    this.cierre_fiscal = data.cierre_fiscal
    this.notificacion = data.notificacion
    this.xPagarMultas.referencia = data.referencia
    this.montoPagadox = this.utilService.ConvertirMoneda(data.montoPagado)
    this.xPagarMultas.montoPagado = data.Monto
    this.xPagarMultas.fechaPago = data.fechaPago
    this.titleModal = data.NombreEmpresa
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async MultaConciliacion(){
  this.xAPI.funcion = 'RECOSUP_U_PagarMultasEmpresasNoInscritas'
   this.xAPI.parametros = ''
   this.xAPI.valores = JSON.stringify(this.xPagarMultas)
   await this.apiService.Ejecutar(this.xAPI).subscribe(
     (data) => {
       this.rowsDetalleMultasNuevas = []
       if (data.tipo === 1) {
         this.router.navigate(['/financial-collection/generate-non-registered-fines']).then(() => {window.location.reload()});
         this.modalService.dismissAll('Close')
         this.utilService.alertConfirmMini('success', 'Conciliacion Exitosamente')
       } else {
         this.utilService.alertConfirmMini('error', 'Oops! Algo Salio Mal, Intente de Nuevo!')
       }
     },
     (error) => {
       console.error(error)
     }
   )    
  }

}


