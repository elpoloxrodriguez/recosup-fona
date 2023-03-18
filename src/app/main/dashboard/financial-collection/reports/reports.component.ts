import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ExcelService } from '@core/services/excel/excel.service'
import { UtilService } from '@core/services/util/util.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

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
    { id: 1, name: 'Todas las Empresas que Declararon un año en Especifico con Monto de Utilidad y Aporte' },
    { id: 2, name: 'Empresas Registradas en el Recosup con Representante Legal ' },
    { id: 3, name: 'Empresas que no han Declarado en Varios años con mas de 50 Trabajadores' },
    { id: 4, name: 'Total Empresas con Correo y Actividad Economica Aprobadas'}
    // REPORTES PREDETERMINADOS
    // { id: 1, name: 'Empresas Aprobadas' },
    // { id: 2, name: 'Empresas por Aprobar' },
    // { id: 3, name: 'Empresas Rechazadas' },
    // { id: 4, name: 'Empresas Corregidas' },
    // { id: 0, name: 'Planilla de Empresas No Inscritas'},
    // { id: 5, name: 'Consulta de Aportes Articulos 32 y 34' },
    // { id: 7, name: 'Cantidad Empresas Aprobadas y Rechazadas en el Sistema' },
    // { id: 8, name: 'Cantidad Empresas Registradas, Corregidas y por Revisar' },
    // { id: 9, name: 'Empresas Declaracion en 0,00 (50 o más trabajadores)' },
    // { id: 10, name: 'Empresas Declaracion en 0,00 (menos de 50 trabajadores)' },
    // { id: 11, name: 'Empresas Delcararon sin Generar Planillas (50 o más trabajadores)' },
    // { id: 12, name: 'Empresas Delcararon sin Generar Planillas (menos de 50 trabajadores)' },
    // { id: 13, name: 'Empresas que han pagado' },
    // { id: 14, name: 'Empresas Pendiente por Pago' },
  ]

  public BtnShow = false
  public inputAnio

  constructor(
    private excelservice: ExcelService,
    private apiService: ApiService,
    private utilservice: UtilService
  ) { }


  ngOnInit(): void {

  }

  // defaultSectionBlockUI() {
  //   this.sectionBlockUI.start();
  //   setTimeout(() => {
  //     this.sectionBlockUI.stop();
  //   }, 2500);
  // }

  async NuevosReportes(id: any) {
    switch (this.itemReports) {
      case 1:
        if (this.itemReports === 1) {
          this.BtnShow = true
        }
        break;
      case 2:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion2";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            console.log(data)
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas Registradas en el Recosup con Representante Legal')
              this.sectionBlockUI.stop(),
                this.BtnShow = false
              this.itemReports = undefined
              this.inputAnio = undefined
            } else {
              this.sectionBlockUI.stop(),
                this.utilservice.alertConfirmMini('error', 'Oops, lo sentimos el reporte se encuenta vacio!')
            }
          },
          (error) => {
            console.log(error)
          }
        )
        break;
        case 3:
          if (this.itemReports === 3) {
            this.BtnShow = true
          }
          break;
          case 4:
            this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
            this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion4";
            this.xAPI.parametros = ''
            this.xAPI.valores = ''
            await this.apiService.Ejecutar(this.xAPI).subscribe(
              (data) => {
                console.log(data)
                if (data.Cuerpo.length > 0) {
                  this.exportAsXLSX(data.Cuerpo, 'Total Empresas con Correo y Actividad Economica Aprobadas')
                  this.sectionBlockUI.stop(),
                    this.BtnShow = false
                  this.itemReports = undefined
                  this.inputAnio = undefined
                } else {
                  this.sectionBlockUI.stop(),
                    this.utilservice.alertConfirmMini('error', 'Oops, lo sentimos el reporte se encuenta vacio!')
                }
              },
              (error) => {
                console.log(error)
              }
            )
            break;
      default:
        break;
    }
  }


  async Reporte1(fecha: any, item: any) {
    switch (item) {
      case 1:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion1";
        this.xAPI.parametros = fecha
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            console.log(data)
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Todas las Empresas que Declararon un año en Especifico con Monto de Utilidad y Aporte')
              this.sectionBlockUI.stop(),
                this.BtnShow = false
              this.itemReports = undefined
              this.inputAnio = undefined
            } else {
              this.sectionBlockUI.stop(),
                this.utilservice.alertConfirmMini('error', 'Oops, lo sentimos el reporte se encuenta vacio!')
            }
          },
          (error) => {
            console.log(error)
          }
        )
        break;
        case 3:
          this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
          this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion3";
          this.xAPI.parametros = fecha
          this.xAPI.valores = ''
          await this.apiService.Ejecutar(this.xAPI).subscribe(
            (data) => {
              console.log(data)
              if (data.Cuerpo.length > 0) {
                this.exportAsXLSX(data.Cuerpo, 'Empresas que no han Declarado en Varios años con mas de 50 Trabajadores')
                this.sectionBlockUI.stop(),
                  this.BtnShow = false
                this.itemReports = undefined
                this.inputAnio = undefined
              } else {
                this.sectionBlockUI.stop(),
                  this.utilservice.alertConfirmMini('error', 'Oops, lo sentimos el reporte se encuenta vacio!')
              }
            },
            (error) => {
              console.log(error)
            }
          )
          break;

      default:
        break;
    }
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
        this.xAPI.parametros = '<=' + ',' + '0.01' + ',' + '50 o mas'
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
        this.xAPI.parametros = '<=' + ',' + '0.01' + ',' + 'Menos de 50'
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

