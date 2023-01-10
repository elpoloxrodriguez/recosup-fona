import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-taxpayers',
  templateUrl: './taxpayers.component.html',
  styleUrls: ['./taxpayers.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],

})
export class TaxpayersComponent implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public token : any

  public ModalTitle
  public dataEmpresasAportes = [];
  public dataEmpresaDocumentosAdjuntos = []
  public sidebarToggleRef = false;
  public rowsEmpresasAportes;
  public rows
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';


  public searchValue = '';


  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;


  // Private
  private tempDataEmpresasAportes = [];
  private tempData = [];
  private tempDataUtilidadAportes = []
  private _unsubscribeAll: Subject<any>;

  constructor(
    private apiService : ApiService,
    private modalService: NgbModal,
  ) { 
    this._unsubscribeAll = new Subject();
  }

  async ngOnInit() {
    this.token =  jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token);
    await this.DocumentosAdjuntosEmpresa()
    
  }

  async DocumentosAdjuntosEmpresa() {
    this.xAPI.funcion = "RECOSUP_R_ListaDocumentosAdjuntos";
    this.xAPI.parametros = '';
    this.dataEmpresasAportes = []
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.dataEmpresasAportes.push(e);
          setTimeout(() => {
            //  dataEmpresasAportes Cierre Fiscal
            this.rowsEmpresasAportes = this.dataEmpresasAportes;
            this.tempDataEmpresasAportes = this.rowsEmpresasAportes;
        }, 450);
        });
        // console.log(this.dataEmpresasAportes)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }

  ModalDetails(modal, data) {
    this.ModalTitle =  data.RazonSocial
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }  

  async listaDocumentosAdjuntosEmpresa(data: any) {
    var empresa = data.IdEmpresa
    var usuario = data.IdUsuario
    this.xAPI.funcion = "RECOSUP_R_DocumentosAdjuntos_Empresas";
    this.xAPI.parametros = empresa+','+usuario;
    console.log(this.xAPI.parametros);
    this.dataEmpresaDocumentosAdjuntos = []
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
         data.Cuerpo.map(e => {
          this.dataEmpresaDocumentosAdjuntos.push(e);
          setTimeout(() => {
            this.rows = this.dataEmpresaDocumentosAdjuntos;
            this.tempData = this.rows;  
          }, 350);  
        });
        // console.log(this.dataEmpresaDocumentosAdjuntos)
      },
      (error) => {
        console.log(error)
      }
    )
  }
  

  filterUpdate(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataEmpresasAportes.filter(function (d) {
      return d.Rif.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsEmpresasAportes = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateDocumentoAdjuntoEmpresa(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempData.filter(function (d) {
      return d.Rif.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rows = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  /**
   * On destroy
   */
   ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}


