import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '@core/services/pdf/pdf.service';
import jwt_decode from "jwt-decode";
import { UtilService } from '@core/services/util/util.service';
import { RECOSUP_C_MultasNuevasMIF, RECOSUP_U_AprobarGanancias, RECOSUP_U_PagarAportesConciliar } from '@core/services/empresa/empresa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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

  public ICrearMultasMIF: RECOSUP_C_MultasNuevasMIF = {
    id_EmpresaId: undefined,
    status_mif: undefined,
    Monto_mif: '',
    Nomenclatura_mif: '',
    TipoMultaId: undefined,
    Cuenta_mif: '',
    UsuarioCreo: undefined
  }

  public rowsDetalleMultasNuevas
  public ListaMultasNuevas = [];
  public tempDataDetalleMultasNuevas = [];

  public rowsUtilidadCierreFiscal
  public Utilidad = [];
  public ListaEmpresas = [];
  public ListaPlanilla = [];
  public rowsDetalleAporte;
  public token


  public EmpresaDetalleMultas

  // public
  public data: any;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;

  public searchValue = '';


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
    console.log(this.UserId)
    await this.DetalleMultas()
    await this.DetalleMultasNuevas()
    await this.ListaEmpresasSimple()
    await this.ListaPlanillas()
  }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------


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
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF";
    this.xAPI.parametros = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          if (e.status_mif == '0') {
            e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
            e.Monto_mif = this.utilservice.ConvertirMoneda(e.Monto_mif)
            this.ListaMultasNuevas.push(e);
          }
        });
        this.rowsDetalleMultasNuevas = this.ListaMultasNuevas;
        this.tempDataDetalleMultasNuevas = this.rowsDetalleMultasNuevas
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async RegistrarMultas() {
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


  async ListaEmpresasSimple() {
    // this.xAPI.funcion = "RECOSUP_R_Empresas_Simple";
    // await this.apiService.Ejecutar(this.xAPI).subscribe(
    //   (data) => {
    //     data.Cuerpo.map(e => {
    //       e.name = '(' + e.Rif + ') - ' + e.RazonSocial
    //       e.id = e.EmpresaId
    //       // return e
    //       this.ListaEmpresas.push(e)
    //     });
    //   },
    //   (error) => {
    //     console.log(error)
    //   }
    // )
    this.ListaEmpresas = JSON.parse(sessionStorage.getItem('Empresas'))
  }

  async ListaPlanillas() {
    this.xAPI.funcion = "RECOSUP_R_ListaPlanillas";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.name = e.nombre_bancos_MIF
          e.id = e.id_bancos_MIF
          this.ListaPlanilla.push(e)
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

    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

}

