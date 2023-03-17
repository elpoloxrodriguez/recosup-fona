import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { NgbModal, NgbActiveModal, NgbModalConfig, NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, DocumentoAdjunto, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";
import { PdfService } from '@core/services/pdf/pdf.service';
import { AngularFileUploaderComponent } from 'angular-file-uploader';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import Stepper from 'bs-stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CoreConfigService } from '@core/services/config.service';
import { UtilService } from '@core/services/util/util.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IActualizarDatosEmpresa, ICrearCertificados, IDataEmpresaCompleta, IEmpresa, IEmpresaContactos, RECOSUP_U_PagarMultas } from '@core/services/empresa/empresa.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-list-current-fines',
  templateUrl: './list-current-fines.component.html',
  styleUrls: ['./list-current-fines.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})

export class ListCurrentFinesComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }

  public xPagarMultas : RECOSUP_U_PagarMultas = {
    banco: 0,
    referencia: '',
    montoPagado: '',
    fechaPago: '',
    UsuarioModifico: 0,
    id_mif: 0,
    status_mif: undefined
  }

  

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

    // Decorator
    @ViewChild('fileUpload1')
    private fileUpload1: AngularFileUploaderComponent
    @ViewChild(DatatableComponent) table: DatatableComponent;
  
    public selectedOption = 10;
    public ColumnMode = ColumnMode;
    public temp = [];

  public searchValue = '';

  public titleModal

  public MontoModal

  public ListaBanco = []


  public ListaMultasNuevas = []
  public rowsDetalleMultasNuevas
  public tempDataDetalleMultasNuevas = []

  public token

  public id_bancoMultas

  constructor(
    public formatter: NgbDateParserFormatter,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private utilService: UtilService,
    private modalService: NgbModal,
    private pdf: PdfService,
    private router: Router,
    private toastrService: ToastrService,
    private rutaActiva: ActivatedRoute

  ) { }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.xPagarMultas.UsuarioModifico = this.token.Usuario[0].EmpresaId
    await this.DetalleMultasNuevas()
  }

  async GenerarConstancia(datay: any){
    // this.pdf.CertificadoPagoMIF(data)
    this.CrearCert.usuario = this.token.Usuario[0].UsuarioId
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
          let ruta: string = btoa('https://recosup.fona.gob.ve');
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

  async DetalleMultasNuevas() {
    this.xAPI.funcion = "RECOSUP_R_ListarMultasNuevasMIF_ID";
    this.xAPI.parametros = this.token.Usuario[0].EmpresaId
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          // if (e.status_mif == '0' || e.status_mif == '2') {
            e.Nomenclatura_mif = e.Nomenclatura_mif.toUpperCase()
            e.Monto_mif = this.utilService.ConvertirMoneda(e.Monto_mif)
            this.ListaMultasNuevas.push(e);
            // }
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

  filterUpdateMIF(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDetalleMultasNuevas.filter(function (d) {
      return d.nombre_bancos_MIF.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDetalleMultasNuevas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }


  async PagarMultasNuevas(modal: any, data: any){
    console.log(data)
    this.xPagarMultas.banco = data.id_banco
    this.xPagarMultas.id_mif = data.id_mif
    this.MontoModal = data.Monto_mif
    this.ListaBanco = [
      {
        id: data.id_banco,
        name: data.cuenta_bancos_MIF +' - '+ '('+data.nombre_banco_bancos_MIF+')'
      }
    ]
    this.titleModal = data.RazonSocial;
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async EditarMultasNuevas(modal: any, data: any){
    // console.log(data)
    this.xPagarMultas.status_mif = 2
    this.xPagarMultas.referencia = data.referencia
    this.xPagarMultas.montoPagado = data.montoPagado
    this.xPagarMultas.banco = data.id_banco
    this.xPagarMultas.id_mif = data.id_mif
    this.MontoModal = data.Monto_mif
    this.xPagarMultas.fechaPago = data.fechaPago
    this.id_bancoMultas = data.id_banco
    this.ListaBanco = [
      {
        id: data.id_banco,
        name: data.cuenta_bancos_MIF +' - '+ '('+data.nombre_banco_bancos_MIF+')'
      }
    ]
    this.titleModal = data.RazonSocial;
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }


  async PagarMultaConciliacion(){
    this.xPagarMultas.status_mif = 2
   this.xAPI.funcion = 'RECOSUP_U_PagarMultas'
  this.xAPI.parametros = ''
  this.xAPI.valores = JSON.stringify(this.xPagarMultas)
  await this.apiService.Ejecutar(this.xAPI).subscribe(
    (data) => {
      // this.rowsDetalleMultasNuevas = []
      if (data.tipo === 1) {
        this.router.navigate(['taxpayer-record/current-fines']).then(() => {window.location.reload()});
        this.modalService.dismissAll('Close')
        this.utilService.alertConfirmMini('success', 'Pago Registrado Exitosamente')
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
