import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ExcelService } from '@core/services/excel/excel.service'
import { UtilService } from '@core/services/util/util.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-legal-reports',
  templateUrl: './legal-reports.component.html',
  styleUrls: ['./legal-reports.component.scss']
})
export class LegalReportsComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public Reporte01
  public itemReports

  public ListReport = [
    { id: 1, name: '(01) - Lista de Actos Recurridos' },
  ]

  constructor(
    private excelservice: ExcelService,
    private apiService: ApiService,
    private utilservice: UtilService
  ) { }

  ngOnInit(): void {
  }

  async SaberQReporteEscogio(event) {
    await this.NuevosReportesX(event)
  }

  async NuevosReportesX(data: any) {
    this.sectionBlockUI.start('Generando Reporte, Porfavor Espere!!!');
    this.xAPI.funcion = "RECOSUP_R_Reporte_RecursoJerarquico_01";
    this.xAPI.parametros = ''
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          this.exportAsXLSX(data.Cuerpo, 'Todas los Recursos Jerarquicos')
          this.sectionBlockUI.stop()
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

  }


  exportAsXLSX(data: any, fileName: string) {
    this.excelservice.exportToExcel(data, fileName)
    this.utilservice.alertConfirmMini('success', 'Archivo Descagado Exitosamente!')
  }

}
