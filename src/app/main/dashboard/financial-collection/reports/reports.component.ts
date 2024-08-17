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
    { id: 7, name: 'Pagados y Conciliados' },
    { id: 17, name: 'Por Conciliar' },
    { id: 18, name: 'Rechazadas' }
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


  public ListReportEmpresasAprobadas = []
  public itemReports
  public statusEmpresa
  public ListReport = [
    { id: 1, name: '(01) - Todas las empresas que declararon un año en especifico con monto de utilidad y aporte' },
    { id: 2, name: '(02) - Empresas que declararon y no generaron APORTE con mas de 50 trabajadores' },
    { id: 3, name: '(03) - Total empresas con correo y actividad economica aprobadas' },
    { id: 4, name: '(04) - Empresas que no han declarado un ejercicio fiscal' },
    { id: 5, name: '(05) - Empresas registradas en el recosup con representante legal' },
    { id: 6, name: '(06) - Empresa Irregulares' },
    { id: 7, name: '(07) - Empresa Regulares' },
    { id: 8, name: '(08) - Consulta de empresas por Activida Económica' },
    { id: 9, name: '09) - Multas Pagadas' },
    { id: 10, name: '(10) - Empresas aprobadas completas que existen en la tabla usuario y en empresas' },
    { id: 11, name: '(11) - Empresas pre-inscritas que no estan completas o no han pasado a la tabla empresa' },
    { id: 12, name: '(12) - Empresas con declaracion y pagos conciliados por año de utilidad' },
    { id: 13, name: '(13) - Lista de Actos Recurridos' },
  ]

  public ListaStatusMIF = [
    { id: 0, name: "Pendientes por Pago" },
    { id: 1, name: "Pagados y Conciliados" },
    { id: 2, name: "Pendiente por Conciliar" },
    { id: 3, name: "Rechazados" }
  ]

  public ListaDeclaracionPagos = [
    { id: 7, name: 'Pagados y Conciliados' },
    { id: 17, name: 'Por Conciliar' },
    { id: 18, name: 'Rechazadas' }
  ]

  public SelectActividadEconomica = [
    { id: 0, name: 'Empresas Doble Aportante' },
    { id: 1, name: 'Empresas Aportantes' },
  ]

  public BtnShow = false
  public inputAnio

  public valor081
  public valor082

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

  public Reporte08_valor1 = undefined
  public Reporte09_valor1 = undefined

  public Reporte11_valor1 = ''
  public Reporte11_valor2 = ''

  public Reporte12_valor1 = ''
  public Reporte12_valor2 = ''
  public Reporte12_valor3 = ''
  public Reporte12_valor4 = 1
  public Reporte12_valor5 = undefined
  public Reporte12_valor6 = ''


  public Reporte01 = []
  public Reporte02 = []
  public Reporte03 = []
  public Reporte04 = []
  public Reporte05 = []
  public Reporte06 = []
  public Reporte07 = []
  public Reporte08 = []
  public Reporte09 = []
  public Reporte010 = []
  public Reporte011 = []
  public Reporte012 = []
  public Reporte013 = []

  constructor(
    private excelservice: ExcelService,
    private apiService: ApiService,
    private utilservice: UtilService
  ) { }


  ngOnInit(): void {

  }


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
      case 5:
        this.btnGenerarReporte = false
        this.ReporteRecaudacion_01 = false
        this.ReporteRecaudacion_02 = false
        this.ReporteRecaudacion_03 = false
        this.ReporteRecaudacion_04 = false
        this.ReporteRecaudacion_05 = false
        this.NuevosReportesX(event)
        break;
      case 6:
        this.btnGenerarReporte = false
        this.ReporteRecaudacion_01 = false
        this.ReporteRecaudacion_02 = false
        this.ReporteRecaudacion_03 = false
        this.ReporteRecaudacion_04 = false
        this.ReporteRecaudacion_05 = false
        this.ReporteRecaudacion_06 = false
        this.NuevosReportesX(event)
        break;
      case 7:
        this.btnGenerarReporte = false
        this.ReporteRecaudacion_01 = false
        this.ReporteRecaudacion_02 = false
        this.ReporteRecaudacion_03 = false
        this.ReporteRecaudacion_04 = false
        this.ReporteRecaudacion_05 = false
        this.ReporteRecaudacion_06 = false
        this.ReporteRecaudacion_07 = false
        this.NuevosReportesX(event)
        break;
      case 8:
        this.btnGenerarReporte = true
        this.ReporteRecaudacion_01 = false
        this.ReporteRecaudacion_02 = false
        this.ReporteRecaudacion_03 = false
        this.ReporteRecaudacion_04 = false
        this.ReporteRecaudacion_05 = false
        this.ReporteRecaudacion_06 = false
        this.ReporteRecaudacion_07 = false
        this.ReporteRecaudacion_08 = true
        break;
      case 9:
        this.btnGenerarReporte = true
        this.ReporteRecaudacion_01 = false
        this.ReporteRecaudacion_02 = false
        this.ReporteRecaudacion_03 = false
        this.ReporteRecaudacion_04 = false
        this.ReporteRecaudacion_05 = false
        this.ReporteRecaudacion_06 = false
        this.ReporteRecaudacion_07 = false
        this.ReporteRecaudacion_08 = false
        this.ReporteRecaudacion_09 = true
        break;
      case 10:
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
        this.NuevosReportesX(event)
        break;
      case 11:
        this.btnGenerarReporte = true
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
        this.ReporteRecaudacion_11 = true
        this.ReporteRecaudacion_12 = false
        break;
      case 12:
        this.btnGenerarReporte = true
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
        this.ReporteRecaudacion_12 = true
        break;
      case 13:
        this.btnGenerarReporte = true
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
        this.ReporteRecaudacion_13 = true
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
        break;
    }
  }

  async NuevosReportesX(data: any) {
    switch (data) {
      case 1:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_01";
        this.xAPI.parametros = this.Reporte01_valor1 + ',' + this.Reporte01_valor2 + ',' + this.Reporte01_valor3 + ',' + this.Reporte01_valor4 + ',' + this.Reporte01_valor5
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // console.log(data)
            data.Cuerpo.forEach(element => {
              element.J_CantidadEmpleados = parseFloat(element.J_CantidadEmpleados)
              element.K_Fecha = parseInt(element.K_Fecha)
              element.L_FechaAporte = parseInt(element.L_FechaAporte)
              element.P_Articulo = parseInt(element.P_Articulo)
              element.Q_FechaHasta = this.utilservice.FechaMomentLLL(element.Q_FechaHasta)
              element.U_FechaBancoPago = this.utilservice.FechaMomentLLL(element.U_FechaBancoPago)
              this.Reporte01.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte01, 'Todas las empresas que declararon un año en especifico con monto de utilidad y aporte')
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
        this.xAPI.parametros = this.Reporte02_valor1 + ',' + this.Reporte02_valor2 + ',' + this.Reporte02_valor3 + ',' + this.Reporte02_valor4 + ',' + this.Reporte02_valor5
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            // console.log(data)
            data.Cuerpo.forEach(element => {
              element.J_CantidadEmpleados = parseFloat(element.J_CantidadEmpleados)
              this.Reporte02.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte02, 'Empresas que declararon y no generaron APORTE con mas de 50 trabajadores')
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
            data.Cuerpo.forEach(element => {
              element.L_CantidadEmpleados = parseFloat(element.L_CantidadEmpleados)
              element.M_FechaCierreFiscal = this.utilservice.FechaMomentLLL(element.M_FechaCierreFiscal)
              this.Reporte03.push(element)
            });
            if (this.Reporte03.length > 0) {
              this.exportAsXLSX(this.Reporte03, 'Total empresas con correo y actividad economica aprobadas')
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
        this.xAPI.parametros = this.Reporte04_valor1 + ',' + this.Reporte04_valor2 + ',' + this.Reporte04_valor3
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.forEach(element => {
              element.L_CantidadEmpleados = parseFloat(element.L_CantidadEmpleados)
              element.M_FechaCierreFiscal = this.utilservice.FechaMomentLLL(element.M_FechaCierreFiscal)
              this.Reporte04.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte04, 'Empresas que no han declarado un ejercicio fiscal')
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
            data.Cuerpo.forEach(element => {
              element.F_CantidadEmpleados = parseFloat(element.F_CantidadEmpleados)
              element.U_FechaCierreFiscal = this.utilservice.FechaMomentLLL(element.U_FechaCierreFiscal)
              element.ZG_FechaCreo = this.utilservice.FechaMomentLLL(element.ZG_FechaCreo)
              element.ZH_FechaAprobo = this.utilservice.FechaMomentLLL(element.ZH_FechaAprobo)
              this.Reporte05.push(element)
            });
            if (this.Reporte05.length > 0) {
              this.exportAsXLSX(this.Reporte05, 'Empresas registradas en el recosup con representante legal')
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
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_06";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.forEach(element => {
              element.K_CantidadEmpleados = parseFloat(element.K_CantidadEmpleados)
              element.L_FechaCierreFiscal = this.utilservice.FechaMomentLLL(element.L_FechaCierreFiscal)
              this.Reporte06.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte06, 'Empresas Irregulares')
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
            data.Cuerpo.forEach(element => {
              element.K_CantidadEmpleados = parseFloat(element.K_CantidadEmpleados)
              element.L_FechaCierreFiscal = this.utilservice.FechaMomentLLL(element.L_FechaCierreFiscal)
              this.Reporte07.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte07, 'Empresas Regulares')
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
        if (this.Reporte08_valor1 === 0) {
          this.xAPI.parametros = '='
        } else {
          this.xAPI.parametros = '!='
        }
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.forEach(element => {
              element.D_CantidadEmpleados = parseFloat(element.D_CantidadEmpleados)
              this.Reporte08.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte08, 'Empresas por Activida Económica')
              this.sectionBlockUI.stop()
              this.Reporte08_valor1 = undefined
              this.itemReports = undefined
              this.ReporteRecaudacion_08 = false
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
      case 9:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_09";
        this.xAPI.parametros = `${this.Reporte09_valor1}`
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.forEach(element => {
              element.O_Notificacion = this.utilservice.FechaMomentLLL(element.O_Notificacion)
              element.Q_InicioFiscal = this.utilservice.FechaMomentLLL(element.Q_InicioFiscal)
              element.R_CierreFiscal = this.utilservice.FechaMomentLLL(element.R_CierreFiscal)
              this.Reporte09.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte09, 'Multas Pagadas')
              this.sectionBlockUI.stop()
              this.Reporte09_valor1 = undefined
              this.itemReports = undefined
              this.ReporteRecaudacion_09 = false
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
      case 10:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_10";
        this.xAPI.parametros = ''
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.forEach(element => {
              element.K_CantidadEmpleados = parseFloat(element.K_CantidadEmpleados)
              element.L_FechaCierreFiscal = this.utilservice.FechaMomentLLL(element.L_FechaCierreFiscal)
              element.M_FechaCreo = this.utilservice.FechaMomentLLL(element.M_FechaCreo)
              this.Reporte010.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte010, 'Empresas aprobadas completas que existen en la tabla usuario y en empresas')
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
        this.xAPI.parametros = this.Reporte11_valor1 + ',' + this.Reporte11_valor2
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.forEach(element => {
              element.L_FechaCreo = this.utilservice.FechaMomentLLL(element.L_FechaCreo)
              this.Reporte011.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte011, 'Empresas pre-inscritas que no estan completas o no han pasado a la tabla empresa')
              this.sectionBlockUI.stop()
              this.Reporte11_valor1 = ''
              this.Reporte11_valor2 = ''
              this.itemReports = undefined
              this.ReporteRecaudacion_11 = false
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
      case 12:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_ReporteRecaudacion_12";
        this.xAPI.parametros = this.Reporte12_valor1 + ',' + this.Reporte12_valor2 + ',' + this.Reporte12_valor3 + ',' + this.Reporte12_valor4 + ',' + this.Reporte12_valor5 + ',' + this.Reporte12_valor6
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.forEach(element => {
              element.H_CantidadEmpleados = parseFloat(element.H_CantidadEmpleados)
              element.I_Fecha = this.utilservice.FechaMomentLLL(element.I_Fecha)
              element.J_FechaAporte = this.utilservice.FechaMomentLLL(element.J_FechaAporte)
              element.K_FechaCreo = this.utilservice.FechaMomentLLL(element.K_FechaCreo)
              element.O_FechaHasta = this.utilservice.FechaMomentLLL(element.O_FechaHasta)
              element.S_FechaBancoPago = this.utilservice.FechaMomentLLL(element.S_FechaBancoPago)
              this.Reporte012.push(element)
            });
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(this.Reporte012, 'Empresas con declaracion y pagos conciliados por año de utilidad')
              this.sectionBlockUI.stop()
              this.Reporte12_valor1 = ''
              this.Reporte12_valor2 = ''
              this.Reporte12_valor3 = ''
              this.Reporte12_valor4 = 1
              this.Reporte12_valor5 = undefined
              this.Reporte12_valor6 = ''
              this.itemReports = undefined
              this.ReporteRecaudacion_12 = false
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
      case 13:
        this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
        this.xAPI.funcion = "RECOSUP_R_Reporte_RecursoJerarquico_01";
        this.xAPI.parametros = this.Reporte12_valor1 + ',' + this.Reporte12_valor2 + ',' + this.Reporte12_valor3 + ',' + this.Reporte12_valor4 + ',' + this.Reporte12_valor5 + ',' + this.Reporte12_valor6
        this.xAPI.valores = ''
        await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.Cuerpo.length > 0) {
              this.exportAsXLSX(data.Cuerpo, 'Todos los Actos Recurridos')
              this.sectionBlockUI.stop()
              this.ReporteRecaudacion_13 = false
              this.btnGenerarReporte = false
            } else {
              this.sectionBlockUI.stop(),
                this.utilservice.alertConfirmMini('error', 'Oops, lo sentimos el reporte se encuenta vacio!')
            }
          },
          (error) => {
            this.sectionBlockUI.stop(),
              this.utilservice.alertConfirmMini('error', 'Oops, lo sentimos el reporte se encuenta vacio!')
            console.log(error)
          }
        )
        break;
      default:
        break;
    }
  }


  exportAsXLSX(data: any, fileName: string) {
    this.excelservice.exportToExcel(data, fileName)
    this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
  }


}

