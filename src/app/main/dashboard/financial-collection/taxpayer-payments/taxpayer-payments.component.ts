import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '@core/services/pdf/pdf.service';
import jwt_decode from "jwt-decode";
import { UtilService } from '@core/services/util/util.service';
import { RECOSUP_U_AprobarGanancias, RECOSUP_U_PagarAportesConciliar } from '@core/services/empresa/empresa.service';

@Component({
  selector: 'app-taxpayer-payments',
  templateUrl: './taxpayer-payments.component.html',
  styleUrls: ['./taxpayer-payments.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class TaxpayerPaymentsComponent implements OnInit {


  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public xRECOSUP_U_PagarAportesConciliar : RECOSUP_U_PagarAportesConciliar = {
    EstatusGeneralId: 0,
    Observacion: '',
    EmpresaGananciaId: 0
  }

  public xRECOSUP_U_AprobarGanancias : RECOSUP_U_AprobarGanancias = {
    EstatusGeneralId: 0,
    EmpresaGananciaId: 0
  }

  public statusPago
  public observacionPago

  public titleModal
  public aporte = {
    fecha: '',
    referencia: '',
    banco: '',
    monto: '',
  }
  public rowsUtilidadCierreFiscal
  public Utilidad = [];
  public ListaStastus = [
    { id: '7', name: 'Aprobado' },
    { id: '18', name: 'Rechazado'  }

  ];
  public rowsDetalleAporte;
  public token

  public IdPago

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

    private tempDataCierreFiscal = [];
    private tempDataUtilidadAportes = []
  

  constructor(
    private apiService : ApiService,
    private modalService: NgbModal,
    private pdf: PdfService,
    private utilservice : UtilService,
  ) {
  }


    // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
   async ngOnInit()  {
    this.token =  jwt_decode(sessionStorage.getItem('token'))
  await this.UtilidadCierreFiscal(this.token.Usuario[0].EmpresaId)
  // await this.ListStatusSystem()
   }
  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  async UtilidadCierreFiscal(id: any) {
    this.xAPI.funcion = "RECOSUP_R_Listar_Pagos_Contribuyentes";
    this.xAPI.parametros = '17'
    // this.xAPI.valores = ''
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
         data.Cuerpo.map(e => {
          e.Monto = this.utilservice.ConvertirMoneda(e.Monto)
          this.Utilidad.push(e)
        });
        // setTimeout(() => {
          this.rowsUtilidadCierreFiscal = this.Utilidad;
          this.tempDataCierreFiscal = this.rowsUtilidadCierreFiscal;
      // }, 450);
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async ConciliarReporte(){
    this.statusPago
    this.observacionPago
    this.xRECOSUP_U_PagarAportesConciliar.EmpresaGananciaId = this.IdPago
    this.xRECOSUP_U_PagarAportesConciliar.EstatusGeneralId = this.statusPago
    this.xRECOSUP_U_PagarAportesConciliar.Observacion = this.observacionPago
    this.xAPI.funcion = 'RECOSUP_U_PagarAportesConciliar'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.xRECOSUP_U_PagarAportesConciliar)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsUtilidadCierreFiscal = []
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilservice.alertConfirmMini('success', 'Conciliaci??n Exitosa!')
          this.UtilidadCierreFiscal(this.token.Usuario[0].EmpresaId)
          if ( this.statusPago == '7') {
            this.xRECOSUP_U_AprobarGanancias.EmpresaGananciaId = this.IdPago
            this.xRECOSUP_U_AprobarGanancias.EstatusGeneralId = 7
            this.xAPI.funcion = 'RECOSUP_U_AprobarGanancias'
            this.xAPI.parametros = ''
            this.xAPI.valores = JSON.stringify(this.xRECOSUP_U_AprobarGanancias)
            this.apiService.Ejecutar(this.xAPI).subscribe(
              (data) => {
                this.utilservice.alertConfirmMini('success', 'Conciliaci??n Exitosa!')
              },
              (err) => {
                console.log(err)
              }
            )
          }
        } else {
          this.utilservice.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async ListStatusSystem() {
    this.xAPI.funcion = "RECOSUP_R_Listar_Estatus_Sistema";
    this.ListaStastus = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ListaStastus = data.Cuerpo.map( e => {
          e.name =  e.Tipo
          e.id = e.EstatusId
          return e
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
    filterUpdate(event) {
      // Reset ng-select on search
      const val = event.target.value.toLowerCase();
      // Filter Our Data
      const temp = this.tempDataCierreFiscal.filter(function (d) {
        return d.ReferenciaBancaria.toLowerCase().indexOf(val) !== -1 || !val;
      });
      // Update The Rows
      this.rowsUtilidadCierreFiscal = temp;
      // Whenever The Filter Changes, Always Go Back To The First Page
      this.table.offset = 0;
    }



    RegistrarPagarAporte(modal, data) {
      this.IdPago = data.EmpresaGananciaId
      this.titleModal = data.RazonSocial
      this.aporte.fecha = data.FechaDocumento
      this.aporte = {
        fecha:  this.utilservice.FechaMomentL(data.FechaDocumento),
        referencia: data.ReferenciaBancaria,
        banco: data.Nombre,
        monto: data.Monto
      }
      this.modalService.open(modal,{
        centered: true,
        size: 'lg',
        backdrop: false,
        keyboard: false,
        windowClass: 'fondo-modal',
      });
    }


}
