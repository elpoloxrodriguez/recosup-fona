import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '@core/services/pdf/pdf.service';
import jwt_decode from "jwt-decode";
import { UtilService } from '@core/services/util/util.service';
import { ICrearCertificados, RECOSUP_C_MultasNuevasMIF, RECOSUP_U_AprobarGanancias, RECOSUP_U_PagarAportesConciliar, RECOSUP_U_PagarMultas } from '@core/services/empresa/empresa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-generate-fines',
  templateUrl: './generate-fines.component.html',
  styleUrls: ['./generate-fines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})

export class GenerateFinesComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public xPagarMultas: RECOSUP_U_PagarMultas = {
    banco: 0,
    referencia: '',
    montoPagado: '',
    fechaPago: '',
    UsuarioModifico: 0,
    id_mif: 0,
    status_mif: undefined,
    Bauche: undefined,
    Observacion: undefined
  }

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }



  public ICrearMultasMIF: RECOSUP_C_MultasNuevasMIF = {
    id_EmpresaId: undefined,
    status_mif: undefined,
    Monto_mif: '',
    Nomenclatura_mif: '',
    TipoMultaId: undefined,
    Cuenta_mif: '',
    UsuarioCreo: undefined,
    articulo: undefined,
    anio: undefined,
    notificacion: undefined,
    inicio_fiscal: undefined,
    cierre_fiscal: undefined,
    monto_declaracion_definitiva: '0.00'
  }

  public añoActual = new Date()
  public DatepickerYear = this.añoActual.getFullYear()
  public DatepickerMonth = this.añoActual.getMonth()

  public SelectAnioAporte = []
  public SelectArticulo = []
  public ActividadEconomicaEmpresa
  public ListaStatusConciliacionMultas = [
    { id: '1', name: 'Aprobado' },
    { id: '3', name: 'Rechazado' }
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

  public inputFIF: boolean = false


  public bancoPagoMultas

  public isLoading: number = 0;

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

  public CamposConciliacionViews = {
    articulo: undefined,
    inicio_fiscal: undefined,
    cierre_fiscal: undefined,
    notificacion: undefined,
    anio: undefined
  }

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
    // if (sessionStorage.getItem('Empresas') != undefined) {
    //   this.ListaEmpresas = JSON.parse(sessionStorage.getItem('Empresas'))
    // } else {
    await this.ListaEmpresasSimple()
    // }
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

  async DetalleMultasNuevas() {
    this.isLoading = 0;
    this.ListaMultasNuevas = []
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF";
    this.xAPI.parametros = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            if (e.status_mif != '1') {
              e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
              e.Monto_mif = this.utilservice.ConvertirMoneda(e.Monto_mif)
              this.ListaMultasNuevas.push(e);
            }
          });
          // console.log(this.ListaMultasNuevas)
          this.rowsDetalleMultasNuevas = this.ListaMultasNuevas;
          this.tempDataDetalleMultasNuevas = this.rowsDetalleMultasNuevas
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

  async GenerarConstancia(datay: any) {
    // console.log(datay)
    // this.pdf.CertificadoPagoMIF(data)
    this.CrearCert.usuario = datay.UsuarioId
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 4, // 1 INSCRIPCIÓN
      this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = "RECOSUP_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://recosup.fona.gob.ve/app/#/certificates');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  this.pdf.CertificadoPagoMIF(datay, xdata.contenido, this.CrearCert.token)
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

  onSelectTipoPlanilla(event) {
    if (event == 4) {
      this.inputFIF = true
    } else {
      this.inputFIF = false
    }

  }

  async mifAprobadas() {
    this.isLoading = 0;
    this.ListaMultasNuevas = []
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF";
    this.xAPI.parametros = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            if (e.status_mif == '1') {
              e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
              e.Monto_mif = this.utilservice.ConvertirMoneda(e.Monto_mif)
              this.ListaMultasNuevas.push(e);
            }
          });
          this.rowsDetalleMultasNuevas = this.ListaMultasNuevas;
          this.tempDataDetalleMultasNuevas = this.rowsDetalleMultasNuevas
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

  async RegistrarMultas() {
    // console.log(this.ICrearMultasMIF)
    this.ICrearMultasMIF.status_mif = 0
    this.ICrearMultasMIF.UsuarioCreo = this.UserId
    this.xAPI.funcion = "RECOSUP_C_MultasNuevasMIF";
    this.xAPI.parametros = ""
    this.xAPI.valores = JSON.stringify(this.ICrearMultasMIF)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsDetalleMultasNuevas.push(this.ListaMultasNuevas)
        if (data.tipo === 1) {
          this.ListaMultasNuevas = []
          this.DetalleMultasNuevas()
          this.modalService.dismissAll('Close')
          this.router.navigate(['/financial-collection/generate-fines']).then(() => { window.location.reload() });
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

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
    // this.router.navigate([this.url]) .then(() => {window.location.reload()});
  }

  async ListaEmpresasSimple() {
    this.xAPI.funcion = "RECOSUP_R_Empresas_Simple";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.name = '(' + e.Rif + ') - ' + e.RazonSocial
          e.id = e.EmpresaId
          // return e
          if (e.status_bloqueo == 1) {
            this.ListaEmpresas.push(e)
          }
        });
        // sessionStorage.setItem('Empresas',  JSON.stringify(this.ListaEmpresas));
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaPlanillas() {
    this.isLoading = 0;
    this.ListaPlanilla = []
    this.xAPI.funcion = "RECOSUP_R_ListaPlanillas";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            e.name = e.nombre_bancos_MIF
            e.id = e.id_bancos_MIF
            this.ListaPlanilla.push(e)
          });
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

  filterUpdateMIF(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDetalleMultasNuevas.filter(function (d) {
      return d.RazonSocial.toLowerCase().indexOf(val) !== -1 || !val;
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
      return d.RazonSocial.toLowerCase().indexOf(val) !== -1 || !val;
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
        this.xAPI.funcion = "RECOSUP_D_MultasMIF";
        this.xAPI.parametros = data.id_mif
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
    if (data.nombre_bancos_MIF === 'Pago Complementario') {
      this.bancoPagoMultas = data.PG_Banco + ' (' + data.nombre_bancos_MIF + ')'
    } else {
      this.bancoPagoMultas = data.nombre_banco_bancos_MIF + ' -  (' + data.cuenta_bancos_MIF + ') - ' + data.nombre_bancos_MIF
    }
    this.MontoModal = data.Monto_mif
    this.xPagarMultas.id_mif = data.id_mif
    this.CamposConciliacionViews.articulo = data.articulo
    this.CamposConciliacionViews.anio = data.anio
    this.CamposConciliacionViews.inicio_fiscal = data.inicio_fiscal
    this.CamposConciliacionViews.cierre_fiscal = data.cierre_fiscal
    this.CamposConciliacionViews.notificacion = data.notificacion
    this.xPagarMultas.UsuarioModifico = this.UserId
    this.xPagarMultas.banco = data.id_banco
    this.xPagarMultas.Bauche = data.Bauche
    this.xPagarMultas.PG_Banco = this.bancoPagoMultas
    this.xPagarMultas.referencia = data.referencia
    this.montoPagadox = this.utilService.ConvertirMoneda(data.montoPagado)
    this.xPagarMultas.montoPagado = data.montoPagado
    this.xPagarMultas.fechaPago = data.fechaPago
    this.titleModal = data.RazonSocial
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async MultaConciliacion() {
    this.xAPI.funcion = 'RECOSUP_U_PagarMultas'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.xPagarMultas)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // this.rowsDetalleMultasNuevas = []
        if (data.tipo === 1) {
          this.router.navigate(['/financial-collection/generate-fines']).then(() => { window.location.reload() });
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

