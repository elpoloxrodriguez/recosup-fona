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

  public ListReportEmpresasAprobadas = []
  public itemReports
  public statusEmpresa
  public ListReport = [
    { id: 1, name: 'Proyectos Aprobados' },
  ]

  constructor(
    private excelservice: ExcelService,
    private apiService: ApiService,
    private utilservice: UtilService
  ) {}

  
  ngOnInit(): void {
   
  }
  

  async ReportEmpresasAprobadas(id: any) {
    switch (this.itemReports) {
      case 1:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.statusEmpresa = 1
        this.xAPI.funcion = "RECOSUP_R_Reports_Empresas";
        this.xAPI.parametros = '=' + ',' + this.statusEmpresa
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.map(e => {
              this.ListReportEmpresasAprobadas.push(e);
            });
            this.itemReports = undefined
            this.exportAsXLSX(this.ListReportEmpresasAprobadas, 'Empresas Aprobadas')
            this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
            this.ListReportEmpresasAprobadas = []
            this.sectionBlockUI.stop();
          },
          (error) => {
            console.log(error)
          }
        )
        break;
      case 2:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.statusEmpresa = 0
        this.xAPI.funcion = "RECOSUP_R_Reports_Empresas";
        this.xAPI.parametros = '=' + ',' + this.statusEmpresa
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.map(e => {
              this.ListReportEmpresasAprobadas.push(e);
            });
            this.itemReports = undefined
            this.exportAsXLSX(this.ListReportEmpresasAprobadas, 'Empresas por Aprobar')
            this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
            this.ListReportEmpresasAprobadas = []
            this.sectionBlockUI.stop();
          },
          (error) => {
            console.log(error)
          }
        )
        break;
      case 3:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.statusEmpresa = 2
        this.xAPI.funcion = "RECOSUP_R_Reports_Empresas";
        this.xAPI.parametros = '=' + ',' + this.statusEmpresa
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.map(e => {
              this.ListReportEmpresasAprobadas.push(e);
            });
            this.itemReports = undefined
            this.exportAsXLSX(this.ListReportEmpresasAprobadas, 'Empresas Rechazadas')
            this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
            this.ListReportEmpresasAprobadas = []
            this.sectionBlockUI.stop();
          },
          (error) => {
            console.log(error)
          }
        )
        break;
      case 4:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.statusEmpresa = 3
        this.xAPI.funcion = "RECOSUP_R_Reports_Empresas";
        this.xAPI.parametros = '=' + ',' + this.statusEmpresa
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.map(e => {
              this.ListReportEmpresasAprobadas.push(e);
            });
            this.itemReports = undefined
            this.exportAsXLSX(this.ListReportEmpresasAprobadas, 'Empresas Corregidas')
            this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
            this.ListReportEmpresasAprobadas = []
            this.sectionBlockUI.stop();
          },
          (error) => {
            console.log(error)
          }
        )
        break;
      case 5:
          this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
          this.xAPI.funcion = "RECOSUP_R_Reports_Empresas_Aportes_Articulos";
          this.xAPI.parametros = '34' // ARTICULOS 32 y 34
          this.xAPI.valores = ''
          await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
              data.Cuerpo.map(e => {
                this.ListReportEmpresasAprobadas.push(e);
              });
              this.itemReports = undefined
              this.exportAsXLSX(this.ListReportEmpresasAprobadas, 'Consulta de Aportes Articulos 32 y 34')
              this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
              this.ListReportEmpresasAprobadas = []
              this.sectionBlockUI.stop();
            },
            (error) => {
              console.log(error)
            }
          )
          break;
      case 9:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
          this.xAPI.funcion = "RECOSUP_R_Reports_Empresas_Declaraciones";
          this.xAPI.parametros = '<=' + ',' + '0.01' +','+ '50 o mas'
          this.xAPI.valores = ''
          await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
              data.Cuerpo.map(e => {
                this.ListReportEmpresasAprobadas.push(e);
              });
              this.itemReports = undefined
              this.exportAsXLSX(this.ListReportEmpresasAprobadas, 'Empresas Declaracion en 0,00 (50 o más trabajadores)')
              this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
              this.ListReportEmpresasAprobadas = []
              this.sectionBlockUI.stop();
            },
            (error) => {
              console.log(error)
            }
          )
          break;
      case 10:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
            this.xAPI.funcion = "RECOSUP_R_Reports_Empresas_Declaraciones";
            this.xAPI.parametros = '<=' + ',' + '0.01' +','+ 'Menos de 50'
            this.xAPI.valores = ''
            await this.apiService.Ejecutar(this.xAPI).subscribe(
              (data) => {
                data.Cuerpo.map(e => {
                  this.ListReportEmpresasAprobadas.push(e);
                });
                this.itemReports = undefined
                this.exportAsXLSX(this.ListReportEmpresasAprobadas, 'Empresas Declaracion en 0,00 (menos de 50 trabajadores)')
                this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
                this.ListReportEmpresasAprobadas = []
                this.sectionBlockUI.stop();
              },
              (error) => {
                console.log(error)
              }
            )
            break;
      default:
        this.statusEmpresa = undefined
        break;
    }
  }

  exportAsXLSX(data: any, fileName: string) {
    this.excelservice.exportToExcel(data, fileName)
    this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
  }


}
