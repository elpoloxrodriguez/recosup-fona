import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IActualizarDatosEmpresa, ICrearCertificados, IDataEmpresaCompleta, RECOSUP_C_AsistenteVirtual, RECOSUP_U_AsistenteVirtual } from '@core/services/empresa/empresa.service';
import { UtilService } from '@core/services/util/util.service';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";
import { PdfService } from '@core/services/pdf/pdf.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-panel-asistente-virtual',
  templateUrl: './panel-asistente-virtual.component.html',
  styleUrls: ['./panel-asistente-virtual.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],

})
export class PanelAsistenteVirtualComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public chatboot: RECOSUP_C_AsistenteVirtual = {
    idio: '',
    tipo: '',
    clas: '',
    preg: '',
    resp: '',
    obse: '',
    id: 0
  }

  public I_U_chatboot: RECOSUP_U_AsistenteVirtual = {
    idio: '',
    tipo: '',
    clas: '',
    preg: '',
    resp: '',
    obse: '',
    id: 0
  }

  public TitleModal

  public ListaIdioma = [
    { id: 1, name: 'Español' }
  ]
  public ListaTipo = [
    { id: 1, name: 'Basico' }
  ]

  public searchValue = '';
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public tempDataAsistenteVirtual = [];
  public rowsAsistenteVirtual = []
  public DataListaAsistenteVirtual = []


  public BtnEnsenar
  public BtnAdd = false
  public BtnUpdate = false

  @ViewChild(DatatableComponent) table: DatatableComponent;


  constructor(
    private apiService: ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private pdf: PdfService,
  ) { }

  async ngOnInit() {
    await this.ListaAsistenteVirtual()
  }

  async ListaAsistenteVirtual() {
    // this.sectionBlockUI.start('Cargando !!!');
    this.xAPI.funcion = "RECOSUP_R_Lista_ChatBot";
    this.xAPI.parametros = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.BtnEnsenar = data.Cuerpo?.length || 0
        data.Cuerpo.map(e => {
          this.DataListaAsistenteVirtual.push(e);
        })
        this.rowsAsistenteVirtual = this.DataListaAsistenteVirtual
        this.tempDataAsistenteVirtual = this.rowsAsistenteVirtual;
        // this.sectionBlockUI.stop();
      },
      (error) => {
        console.log(error)
      }
    )
  }

  Delete(data: any) {
    // console.log(data)
    Swal.fire({
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
        this.xAPI.funcion = "RECOSUP_D_Lista_ChatBot";
        this.xAPI.parametros = data.id
        this.xAPI.valores = ''
        this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            this.rowsAsistenteVirtual.push(this.DataListaAsistenteVirtual)
            if (data.tipo === 1) {
              this.DataListaAsistenteVirtual = []
              this.ListaAsistenteVirtual()
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

  ModalAdd(modal) {
    this.TitleModal = 'Enseñar al Asistente Virtual'
    this.BtnAdd = true
    this.BtnUpdate = false
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  ModalUpdate(modal, data) {
    // console.log(data);
    this.TitleModal = 'Actualizar al Asistente Virtual'
    this.BtnAdd = false
    this.BtnUpdate = true
    this.chatboot.preg = data.preg
    this.chatboot.resp = data.resp
    this.chatboot.id = data.id
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  async EnsenarAsistente() {
    // console.log(this.chatboot)
    this.chatboot.tipo = '1'
    this.chatboot.clas = ''
    this.chatboot.obse = ''
    this.chatboot.idio = '1.00'
    this.chatboot.id = 0
    this.xAPI.funcion = 'RECOSUP_C_AsistenteVirtual'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.chatboot)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsAsistenteVirtual.push(this.DataListaAsistenteVirtual)
        if (data.tipo === 1) {
          this.DataListaAsistenteVirtual = []
          this.chatboot.id = data.msj
          this.ListaAsistenteVirtual()
          this.utilService.alertConfirmMini('success', 'Enseñanza Registrada Exitosamente')
          this.modalService.dismissAll('Close')
          window.location.reload()
        } else {
          this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }


  async UpdateEnsenarAsistente() {
    // console.log(this.chatboot)
    this.chatboot.tipo = '1'
    this.chatboot.clas = ''
    this.chatboot.obse = ''
    this.chatboot.idio = '1.00'
    this.xAPI.funcion = 'RECOSUP_U_AsistenteVirtual'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.chatboot)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.rowsAsistenteVirtual.push(this.DataListaAsistenteVirtual)
        if (data.tipo === 1) {
          this.DataListaAsistenteVirtual = []
          this.ListaAsistenteVirtual()
          this.utilService.alertConfirmMini('success', 'Enseñanza Actualizada Exitosamente')
          this.modalService.dismissAll('Close')
          window.location.reload()
        } else {
          this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }



  filterUpdate(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempDataAsistenteVirtual.filter(function (d) {
      return d.preg.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rowsAsistenteVirtual = temp;
    this.table.offset = 0;
  }

}
