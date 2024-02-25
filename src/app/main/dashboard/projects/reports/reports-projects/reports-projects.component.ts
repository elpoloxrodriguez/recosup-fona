import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ExcelService } from '@core/services/excel/excel.service'
import { UtilService } from '@core/services/util/util.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-reports-projects',
  templateUrl: './reports-projects.component.html',
  styleUrls: ['./reports-projects.component.scss']
})
export class ReportsProjectsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public ListProyectosAprobadas = []
  public ListProyectosRechazados = []
  public ListMovimientosEvaluacion = []

  public itemReports
  public statusEmpresa
  public ListReport = [
    { id: 1, name: 'Proyectos Aprobados' },
    { id: 2, name: 'Proyectos Rechazados' },
    { id: 3, name: 'Movimientos de Evaluaciones' },
  ]

  public showItem: boolean = false

  public years: number[];

  public itemYears

  constructor(
    private excelservice: ExcelService,
    private apiService: ApiService,
    private utilservice: UtilService
  ) {
    const currentYear = new Date().getFullYear();
    this.years = [];
    for (let i = 2023; i <= currentYear; i++) {
      this.years.push(i);
    }
  }


  ngOnInit(): void {

  }


  async ReportEmpresasAprobadas(id: any) {
    if (id != null) {
      switch (id) {
        case 1:
          this.showItem = false
          this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
          this.xAPI.funcion = "RECOSUP_R_ReporteProyecto1";
          this.xAPI.parametros = '1'
          this.xAPI.valores = ''
          await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
              data.Cuerpo.map(e => {
                this.ListProyectosAprobadas.push(e);
              });
              this.exportAsXLSX(this.ListProyectosAprobadas, 'Proyectos Aprobadas')
              this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
              this.ListProyectosAprobadas = []
              this.sectionBlockUI.stop();
            },
            (error) => {
              console.log(error)
            }
          )
          break;
        case 2:
          this.showItem = false
          this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
          this.xAPI.funcion = "RECOSUP_R_ReporteProyecto1";
          this.xAPI.parametros = '2'
          this.xAPI.valores = ''
          await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
              data.Cuerpo.map(e => {
                this.ListProyectosRechazados.push(e);
              });
              this.exportAsXLSX(this.ListProyectosRechazados, 'Proyectos Rechazados')
              this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
              this.ListProyectosRechazados = []
              this.sectionBlockUI.stop();
            },
            (error) => {
              console.log(error)
            }
          )
          break;
        case 3:
          this.showItem = true
          break;
        default:
          this.statusEmpresa = undefined
          break;
      }
    }
  }


  async reporte3(anio: any) {
    if (anio != undefined) {
      this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
      this.xAPI.funcion = "RECOSUP_R_ReporteProyecto2";
      this.xAPI.parametros = `${anio}`
      this.xAPI.valores = ''
      await this.apiService.Ejecutar(this.xAPI).subscribe(
        (data) => {
          data.Cuerpo.map(e => {
            this.ListMovimientosEvaluacion.push(e);
          });
          this.exportAsXLSX(this.ListMovimientosEvaluacion, 'Movimientos Evalacion')
          this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
          this.ListMovimientosEvaluacion = []
          this.sectionBlockUI.stop();
        },
        (error) => {
          console.log(error)
        }
      )
    } else {
      this.utilservice.alertConfirmMini('warning', 'Debe seleccionar el año!')
    }
  }

  exportAsXLSX(data: any, fileName: string) {
    this.excelservice.exportToExcel(data, fileName)
    this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
  }


}
