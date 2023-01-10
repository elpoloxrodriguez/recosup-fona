import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbModalConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import JSONFormatter from 'json-formatter-js';

@Component({
  selector: 'app-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }

})
export class TableManagementComponent implements OnInit {



  public contentHeader: object;
  public developer = []
  public quality = []
  public production = []

  public shopSidebarToggle = false;
  public shopSidebarReset = false;
  public gridViewRef = false;
  public products;
  public wishlist;
  public cartList;
  public page = 1;
  public pageSize = 9;
  public searchText = '';

  closeResult: string = ''

  codeTypeJs = ''
  data: any;
  xentorno: string = ''
  resultado: any;
  xresultado: any;
  xparametro: string = ''
  valores: string = ''



  public xAPI: IAPICore;




  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private apiService: ApiService,
  ) {
    config.backdrop = false;
    config.keyboard = false;
  }


    /**
   * Update to List View
   */
     listView() {
      this.gridViewRef = false;
    }
  
    /**
     * Update to Grid View
     */
    gridView() {
      this.gridViewRef = true;
    }

      /**
   * Sort Product
   */
  sortProduct(sortParam) {
    // this._ecommerceService.sortProduct(sortParam);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  RegistrarAPI(content) {
    this.modalService.open(content, {
      centered: true,
      size: 'lg',
      scrollable: true
    }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }


  async ListarApis() {
    this.developer = []
    this.quality = []
    this.production = []
    await this.apiService.Listar().subscribe(
      (data) => {
        data.forEach(e => {
          switch (e.entorno) {
            case "desarrollo":
              this.developer.push(e)
              break;
              case "calidad":
                this.quality.push(e)
                break;
                case "produccion":
                  this.production.push(e)
                  break;
                  default:
                    break;
                  }
                });
                
      },
      (error) => {
        console.error(error)
      }
    );
  }


  async ngOnInit() {
    this.ListarApis()
    this.products = this.developer;
  }


}
