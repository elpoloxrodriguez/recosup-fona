import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { colors } from 'app/colors.const';
import { UtilService } from '@core/services/util/util.service';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';


@Component({
  selector: 'app-goal-management',
  templateUrl: './goal-management.component.html',
  styleUrls: ['./goal-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GoalManagementComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public MontoRecaudacionAnioAnterior = []
  public MontoRecaudacionAnioActual = []
  public recaudacion = []
  public anios = []
  public CapacidadGraficos = 0
  // public
  public radioModel = 1;

  // Color Variables
  private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
  private lineChartPrimary = '#666ee8';
  private lineChartDanger = '#ff4961';
  private labelColor = '#6e6b7b';
  private grid_line_color = 'rgba(200, 200, 200, 0.2)'; // RGBA color helps in dark layout

  public añoActual = new Date()
  public año = this.añoActual.getFullYear()
  public añoAc = this.año
  public añoAn = this.año - 1

  public FechaDesde = ''
  public FechaHasta = ''

  // line chart
  public lineChart = {
    chartType: 'line',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: false,
      hover: {
        mode: 'label'
      },
      tooltips: {
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: this.tooltipShadow,
        backgroundColor: colors.solid.white,
        titleFontColor: colors.solid.black,
        bodyFontColor: colors.solid.black
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            },
            gridLines: {
              display: true,
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color
            },
            ticks: {
              fontColor: this.labelColor
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            },
            ticks: {
              stepSize: 5000000,
              min: 0,
              max: 150000000,
              fontColor: this.labelColor
            },
            gridLines: {
              display: true,
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color
            }
          }
        ]
      },
      layout: {
        padding: {
          top: -15,
          bottom: -25,
          left: -15
        }
      },
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          padding: 25,
          boxWidth: 9
        }
      }
    },

    // labels: this.recaudacion,
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    datasets: [
      {
        data: this.MontoRecaudacionAnioAnterior,
        label: `Recaudación Año Desde ${this.FechaDesde}`,
        borderColor: this.lineChartDanger,
        lineTension: 0.1,
        pointStyle: 'circle',
        backgroundColor: this.lineChartDanger,
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 5,
        pointBorderColor: 'transparent',
        pointHoverBorderColor: colors.solid.white,
        pointHoverBackgroundColor: this.lineChartDanger,
        pointShadowOffsetX: 1,
        pointShadowOffsetY: 1,
        pointShadowBlur: 5,
        pointShadowColor: this.tooltipShadow
      },
      {
        // data: [32332,3334,8346,13253,36575,33455,23365,66745,5565,56464,9787,776585],
        data: this.MontoRecaudacionAnioActual,
        label: `Recaudación Año Hasta ${this.FechaHasta}`,
        borderColor: this.lineChartPrimary,
        lineTension: 0.1,
        pointStyle: 'circle',
        backgroundColor: this.lineChartPrimary,
        fill: false,
        pointRadius: 5,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 5,
        pointBorderColor: 'transparent',
        pointHoverBorderColor: colors.solid.white,
        pointHoverBackgroundColor: this.lineChartPrimary,
        pointShadowOffsetX: 1,
        pointShadowOffsetY: 1,
        pointShadowBlur: 5,
        pointShadowColor: this.tooltipShadow
      },
    ]
  };


  //** To add spacing between legends and chart
  public plugins = [
    {
      beforeInit(chart) {
        chart.legend.afterFit = function () {
          this.height += 20;
        };
      }
    }
  ];


  /**
   *
   */
  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
  ) {
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    // content header
    await this.DataRecaudacionAnioAnterior(this.FechaDesde ? this.FechaDesde : this.añoAn)
    await this.DataRecaudacionAnioActual(this.FechaHasta ? this.FechaHasta : this.añoAc)
    this.CapacidadGraficos = 30000000
  }


  async DataRecaudacionAnioAnterior(fecha) {
    // this.MontoRecaudacionAnioAnterior = []
    this.xAPI.funcion = "RECOSUP_R_GestionMetasRecaudacion";
    var fec = this.FechaDesde ? this.FechaDesde : this.añoAn
    this.xAPI.parametros = fecha.toString()
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(AnioAnterior => {
          this.MontoRecaudacionAnioAnterior.push(this.utilService.RevertirConvertirMoneda(AnioAnterior.MontoTotal))
          //  console.log(AnioAnterior.MontoMayor)
        })
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DataRecaudacionAnioActual(fecha) {
    // this.MontoRecaudacionAnioActual = []
    this.xAPI.funcion = "RECOSUP_R_GestionMetasRecaudacion";
    var fec = this.FechaHasta ? this.FechaHasta : this.añoAc
    this.xAPI.parametros = fecha.toString()
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(AnioActual => {
          this.MontoRecaudacionAnioActual.push(this.utilService.RevertirConvertirMoneda(AnioActual.MontoTotal))
          // console.log(AnioActual.MontoMayor)
        })
      },
      (error) => {
        console.log(error)
      }
    )
  }

}
