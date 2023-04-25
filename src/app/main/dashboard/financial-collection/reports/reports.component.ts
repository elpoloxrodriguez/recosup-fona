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

  public SelectReporte01 = [
    {id: 7, name: 'Pagados y Conciliados' },
    {id: 17, name: 'Por Conciliar' },
    {id: 18, name: 'Rechazadas' }
  ]


  public btnGenerarReporte = false

  public ReporteRecaudacion_01 = false
  public ReporteRecaudacion_02 = false
  public ReporteRecaudacion_03 = false
  public ReporteRecaudacion_04 = false
  public ReporteRecaudacion_05 = false
  public ReporteRecaudacion_06 = false
  public ReporteRecaudacion_07 = false
  public ReporteRecaudacion_08 = false
  public ReporteRecaudacion_09 = false
  public ReporteRecaudacion_10 = false
  public ReporteRecaudacion_11 = false
  public ReporteRecaudacion_12 = false
  public ReporteRecaudacion_13 = false
  public ReporteRecaudacion_14 = false
  public ReporteRecaudacion_15 = false


  public ListReportEmpresasAprobadas = []
  public itemReports
  public statusEmpresa
  public ListReport = [
    { id: 1, name: 'Todas las empresas que declararon un año en especifico con monto de utilidad y aporte' },
    { id: 2, name: 'Empresas que declararon y no generaron APORTE con mas de 50 trabajadores' },
    { id: 3, name: 'Total empresas con correo y actividad economica aprobadas' },
    { id: 4, name: 'Empresas que no han declarado un ejercicio fiscal' },
    { id: 5, name: 'Empresas que declaradon y no generaron planilla con mas de 50 trabajadores' },
    { id: 6, name: 'Total empresas con correo y actividad economica aprobadas' },
    { id: 7, name: 'Empresas que no han declarado en varios años con mas de 50 trabajadores' },
    { id: 8, name: 'Empresas registradas en el recosup con representante legal' },
    { id: 9, name: 'Empresas registradas en el recosup con 50 o mas tarbajadores que no declararon un año en especifico' },
    { id: 10, name: 'Empresa Irregulares' },
    { id: 11, name: 'Consulta de empresas por Activida Económica' },
    { id: 12, name: 'Multas pagadas' },
    { id: 13, name: 'Empresas aprobadas completas que existen en la tabla usuario y en empresas' },
    { id: 14, name: 'Empresas pre-inscritas que no estan completas o no han pasado a la tabla empresa' },
    { id: 15, name: 'Empresas con declaracion y pagos conciliados por año de utilidad' }
    // { id: 1, name: 'Todas las Empresas que Declararon un año en Especifico con Monto de Utilidad y Aporte' },
    // { id: 2, name: 'Empresas Registradas en el Recosup con Representante Legal ' },
    // { id: 3, name: 'Empresas que no han Declarado en Varios años con mas de 50 Trabajadores' },
    // { id: 4, name: 'Total Empresas con Correo y Actividad Economica Aprobadas'}
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



  public Reporte01_valor1
  public Reporte01_valor2
  public Reporte01_valor3 = 1
  public Reporte01_valor4 = undefined
  public Reporte01_valor5

  public Reporte02_valor1
  public Reporte02_valor2
  public Reporte02_valor3 = 1
  public Reporte02_valor4 = 2
  public Reporte02_valor5

  public Reporte04_valor1
  public Reporte04_valor2 = 1
  public Reporte04_valor3

  
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

  SaberQReporteEscogio(event) {
    switch (event) {
      case 1:
        this.btnGenerarReporte = true
        this.ReporteRecaudacion_01 = true
        this.ReporteRecaudacion_02 = false
        break;
        case 2:
          this.btnGenerarReporte = true
          this.ReporteRecaudacion_01 = false
          this.ReporteRecaudacion_02 = true
          break;
         case 3:
          this.btnGenerarReporte = false
          this.ReporteRecaudacion_01 = false
          this.ReporteRecaudacion_02 = false  
          this.ReporteRecaudacion_03 = false  
          this.NuevosReportesX(event)
          break;
          case 4:
            this.btnGenerarReporte = true
            this.ReporteRecaudacion_01 = false
            this.ReporteRecaudacion_02 = false  
            this.ReporteRecaudacion_03 = false  
            this.ReporteRecaudacion_04 = true  
            break;          
    
      default:
        this.btnGenerarReporte = false
        this.ReporteRecaudacion_01 = false
        this.ReporteRecaudacion_02 = false
        this.ReporteRecaudacion_03 = false
        this.ReporteRecaudacion_04 = false
        this.ReporteRecaudacion_05 = false
        this.ReporteRecaudacion_06 = false
        this.ReporteRecaudacion_07 = false
        this.ReporteRecaudacion_08 = false
        this.ReporteRecaudacion_09 = false
        this.ReporteRecaudacion_10 = false
        this.ReporteRecaudacion_11 = false
        this.ReporteRecaudacion_12 = false
        this.ReporteRecaudacion_13 = false
        this.ReporteRecaudacion_14 = false
        this.ReporteRecaudacion_15 = false
      
        break;
    }
  }

  async NuevosReportesX(data: any) {
    switch (data) {
      case 1:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_01";
        this.xAPI.parametros = this.Reporte01_valor1+','+this.Reporte01_valor2+','+this.Reporte01_valor3+','+this.Reporte01_valor4+','+this.Reporte01_valor5
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // console.log(data)
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Todas las empresas que declararon un año en especifico con monto de utilidad y aporte')
              this.sectionBlockUI.stop()
               this.Reporte01_valor1 = ''
              this.Reporte01_valor2 = ''
              this.Reporte01_valor3 = 1
              this.Reporte01_valor4 = undefined
              this.Reporte01_valor5 = ''
              this.itemReports = undefined
              this.ReporteRecaudacion_01 = false
              this.btnGenerarReporte = false
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
      case 2:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_02";
        this.xAPI.parametros = this.Reporte02_valor1+','+this.Reporte02_valor2+','+this.Reporte02_valor3+','+this.Reporte02_valor4+','+this.Reporte02_valor5
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas que declararon y no generaron APORTE con mas de 50 trabajadores')
              this.sectionBlockUI.stop()
              this.Reporte02_valor1 = ''
             this.Reporte02_valor2 = ''
             this.Reporte02_valor3 = 1
             this.Reporte02_valor4 = undefined
             this.Reporte02_valor5 = ''
             this.itemReports = undefined
             this.ReporteRecaudacion_02 = false
             this.btnGenerarReporte = false
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
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_03";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Total empresas con correo y actividad economica aprobadas')
              this.sectionBlockUI.stop()
              this.itemReports = undefined
              this.ReporteRecaudacion_03 = false
              this.btnGenerarReporte = false

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
      case 4:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_04";
        this.xAPI.parametros = this.Reporte04_valor1+','+this.Reporte04_valor2+','+this.Reporte04_valor3
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas que no han declarado un ejercicio fiscal')
              this.sectionBlockUI.stop()
              this.Reporte04_valor1 = ''
              this.Reporte04_valor2 = 1
              this.Reporte04_valor3 = ''
              this.itemReports = undefined
              this.ReporteRecaudacion_04 = false
              this.btnGenerarReporte = false
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
      case 5:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_05";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas que declaradon y no generaron planilla con mas de 50 trabajadores')
              this.sectionBlockUI.stop()
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
      case 6:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_03";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Total empresas con correo y actividad economica aprobadas')
              this.sectionBlockUI.stop()
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
      case 7:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_07";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas que no han declarado en varios años con mas de 50 trabajadores')
              this.sectionBlockUI.stop()
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
      case 8:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_08";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas registradas en el recosup con representante legal')
              this.sectionBlockUI.stop()
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
      case 9:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_09";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas registradas en el recosup con 50 o mas tarbajadores que no declararon un año en especifico')
              this.sectionBlockUI.stop()
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
      case 10:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_10";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresa Irregulares')
              this.sectionBlockUI.stop()
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
      case 11:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_11";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Consulta de empresas por Activida Económica')
              this.sectionBlockUI.stop()
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
      case 12:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_12";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Multas pagadas')
              this.sectionBlockUI.stop()
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
      case 13:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_13";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas aprobadas completas que existen en la tabla usuario y en empresas')
              this.sectionBlockUI.stop()
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
      case 14:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_14";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas pre-inscritas que no estan completas o no han pasado a la tabla empresa')
              this.sectionBlockUI.stop()
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
      case 15:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_15";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Empresas con declaracion y pagos conciliados por año de utilidad')
              this.sectionBlockUI.stop()
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

