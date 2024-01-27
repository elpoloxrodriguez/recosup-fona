import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { UtilService } from '@core/services/util/util.service';


@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal]
})
export class AuditComponent implements OnInit {


  @ViewChild(DatatableComponent) table: DatatableComponent;

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public offset

  public CedulaMilitar

  public img
  public detalleModal
  public modalTitle
  public modalID
  public modalBtn
  public modalMethod = false

  public contentHeader: object;
  public searchValue = ''
  public basicSelectedOption: number = 10;
  public ColumnMode = ColumnMode;

  public basicSelectedOptionM: number = 5;
  public ColumnModeM = ColumnMode;
  public rowDataM
  public searchValueM = ''
  public countM = 0
  public tempDataM

  public textLoading = ''

  public rowData
  public count = 0
  public tempData

  public LstAuditorias = []
  public rowDataUnidades
  public tempDataUnidades
  public loadingIndicator: boolean = true;
  public loadingIndicatorM: boolean = true;



  constructor(
    private sanitizer: DomSanitizer,
    private utilservice: UtilService,
    private modalService: NgbModal,
    private apiService: ApiService,
  ) { }


  async ngOnInit() {

    await this.LstAuditoria()


    // content header
    this.contentHeader = {
      headerTitle: 'Auditoria',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Inicio',
            isLink: true,
            link: '/home'
          },
          {
            name: 'Auditoria',
            isLink: false
          },
          {
            name: 'Lista',
            isLink: false
          }
        ]
      }
    };
  }


  filterSearch(event: any) {
    const val = event.target.value.toLowerCase();
    // Filtrar nuestros datos
    const temp = this.tempData.filter((d: any) => {
      return (d.usuario.usuario && typeof d.usuario.usuario === 'string' && d.usuario.usuario.toLowerCase().includes(val)) || d.usuario.usuario.toLowerCase().includes(val) || !val;
    });
    // Actualizar las filas
    this.rowData = temp;
    this.count = this.rowData.length;
    // Siempre que el filtro cambie, volver a la primera página
    if (this.table) {
      this.offset = 0;
    }
  }
  

  async LstAuditoria() {
    this.loadingIndicator = true;
    this.LstAuditorias = []
    this.xAPI.funcion = "RECOSUP_R_Auditoria";
    this.xAPI.parametros = ''
    this.xAPI.valores = null
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
        if (data.length >= 1) {
          this.LstAuditorias = data.sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });
          this.rowData = this.LstAuditorias;
          this.tempData = this.rowData;
          this.loadingIndicator = false;
        } else {
          this.loadingIndicator = false;
        }  
      },
      (error) => {
        this.rowData = []
        this.loadingIndicator = false;
        console.error(error)
      }
    )
  }


  async ModalDetalle(modal,row) {
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }


}

