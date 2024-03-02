import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ICrearCertificados } from '@core/services/empresa/empresa.service';
import { PdfService } from '@core/services/pdf/pdf.service';
import { UtilService } from '@core/services/util/util.service';
import jwt_decode from "jwt-decode";
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Auditoria, InterfaceService } from 'app/main/audit/auditoria.service';

import { colors } from 'app/colors.const';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})


export class DashboardComponent implements OnInit {


  public usuarios: number = 0
  public empresas: number = 0
  public recursos: number = 0
  public proyectos: number = 0

  public dobleaportante = []
  public ValorAltoAportante = []
  public aportante = []



  public CapacidadGraficos = 0
  // public
  public radioModel = 1;

  // Color Variables
  private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
  private lineChartPrimary = '#0000ff';
  private lineChartDanger = '#ff0500';
  private labelColor = '#6e6b7b';
  private grid_line_color = 'rgba(200, 200, 200, 0.2)'; // RGBA color helps in dark layout


  // donues chart
  public donusChart01 = {
    chartType: 'pie',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: false,
      hover: {
        mode: 'label'
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
    labels: ['Utilidad y Aporte', 'Utilidad y sin Aporte', 'Regulares', 'Irregulares'],
    datasets: [
      {
        data: [30, 45, 78, 45],
        label: `EMPRESAS DOBLE APORTANTES`,
      },
    ]
  };

  public donusChart02 = {
    chartType: 'pie',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: false,
      hover: {
        mode: 'label'
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
    labels: ['Conciliadas Pagada', 'Pendiente Pago', 'Pendientes Conciliar', 'No Inscritas Pagads', 'No Inscritas Pendiente Pago'],
    datasets: [
      {
        data: [30, 45, 78, 45, 60],
        label: `EMPRESAS DOBLE APORTANTES`,
      },
    ]
  };


  // bar chart
  public barChart = {
    chartType: 'bar',
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
        shadowBlur: 1,
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
              stepSize: 100,
              min: 0,
              max: this.ValorAltoAportante[0],
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
    labels: ['EMPRESAS - RECOSUP'],
    datasets: [
      {
        data: this.dobleaportante,
        label: `EMPRESAS DOBLE APORTANTES`,
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
        data: this.aportante,
        label: `EMPRESAS APORTANTES`,
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
        shadowBlur: 1,
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
              stepSize: 100,
              min: 0,
              max: 1000,
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
        data: [332, 334, 346, 153, 575, 455, 365, 145, 455, 564, 977, 775],
        label: `Metas Año 2023`,
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
        data: [122, 234, 836, 353, 375, 325, 235, 645, 555, 264, 487, 585],
        label: `Metas Año 2024`,
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


  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };


  public xAuditoria: Auditoria = {
    id: '',
    usuario: '',
    funcion: '',
    metodo: '',
    fecha: '',
  }

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }

  public fecha

  public FechaModificoUsuario
  public IdEmpresa
  public DataEmpresa
  public token
  public empresa = false
  public usuario = false
  public admin: boolean = false

  public ListaEmpresas: any = []

  public UsuarioId

  public tokenA

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private _router: Router,
    private pdf: PdfService,
  ) { }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    this.fecha = this.utilService.FechaMoment(new Date())
    this.CapacidadGraficos = 5000
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.FechaModificoUsuario = this.token.Usuario[0].FechaModifico

    await this.Panel01()
    await this.Panel02()



    this.IdEmpresa = this.token.Usuario[0].EmpresaId
    this.UsuarioId = this.token.Usuario[0].UsuarioId

    if (this.token.Usuario[0].EsAdministrador != 0) {
      await this.CambiarContraseñaUsuarioInterno()
    } else {
      await this.CambiarContraseñaEmpresa()
    }

    // await this.ListaEmpresasSimple()
    await this.EmpresaRIF(this.token.Usuario[0].Rif)
    // if (this.token.Usuario[0].EsAdministrador != "9") {
    //   this.usuario = true
    //   this.empresa = false
    // } else {
    //   this.usuario = false
    //   this.empresa = true
    // }
    switch (this.token.Usuario[0].EsAdministrador) {
      case '0':
        this.usuario = true
        this.empresa = false
        this.admin = false
        break;
      case '9':
        this.usuario = false
        this.empresa = true
        this.admin = true
        break;
      case '10':
        this.usuario = false
        this.empresa = true
        this.admin = true
        break;
      default:
        this.usuario = false
        this.empresa = true
        this.admin = false
        break;
    }
  }

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "RECOSUP_R_empresa_rif";
    this.xAPI.parametros = id
    this.DataEmpresa = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.DataEmpresa = data.Cuerpo;
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async Panel01() {
    this.xAPI.funcion = "RECOSUP_R_PanelPrincipal01";
    this.xAPI.parametros = ''
    this.xAPI.valores = {}
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.usuarios = data.Cuerpo[0].total_usuarios
        this.empresas = data.Cuerpo[0].total_empresas
        this.recursos = data.Cuerpo[0].total_recursos_jerarquicos
        this.proyectos = data.Cuerpo[0].total_proyectos
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async Panel02() {
    this.xAPI.funcion = "RECOSUP_R_PanelPrincipal02";
    this.xAPI.parametros = ''
    this.xAPI.valores = {}
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {

        const max = (arr: number[]) => Math.max(...arr);
        const maxDobleAportante = max(data.Cuerpo[0].total_doble_aportantes);
        const maxAportante = max(data.Cuerpo[0].total_aportantes);

        if (maxDobleAportante > maxAportante) {
          // console.log("El arreglo 'this.dobleaportante' tiene el valor más alto.");
          this.ValorAltoAportante.push(parseInt(data.Cuerpo[0].total_doble_aportantes))
          // console.log(this.ValorAltoAportante)
        } else if (maxDobleAportante < maxAportante) {
          // console.log("El arreglo 'this.aportante' tiene el valor más alto.");
          this.ValorAltoAportante.push(parseInt(data.Cuerpo[0].total_aportantes))
          // console.log(this.ValorAltoAportante)

        } else {
          // console.log("Ambos arreglos tienen el mismo valor máximo.");
          this.ValorAltoAportante.push(9999)
          // console.log(this.ValorAltoAportante)
        }

        this.dobleaportante.push(data.Cuerpo[0].total_doble_aportantes)
        this.aportante.push(data.Cuerpo[0].total_aportantes)
      },
      (error) => {
        console.log(error)
      }
    )
  }



  async GenerarCertificadoInscripcion() {
    this.CrearCert.usuario = this.token.Usuario[0].UsuarioId
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 1, // 1 INSCRIPCIÓN
      this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = "RECOSUP_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://recosup.fona.gob.ve/app/#/certificates');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DataEmpresa[0]
                  this.pdf.CertificadoInscripcion(sdata[0], xdata.contenido, this.CrearCert.token)
                  this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                },
                (error) => {
                  console.log(error)
                }
              )
            },
            (error) => {
              console.log(error)
            }
          )
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async CambiarContraseñaEmpresa() {
    this.xAPI.funcion = "RECOSUP_R_UsuarioId";
    this.xAPI.parametros = this.UsuarioId
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          let FechaToken = e.FechaModifico
          const ConvertirFechaToken = new Date(FechaToken).getFullYear()
          setTimeout(() => {
            if (ConvertirFechaToken < 2023) {
              this._router.navigate(['user/profile']).then(() => { window.location.reload() });
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                html: 'Estimado Usuario <br>  Recomendamos Cambiar la Contraseña de Acceso al Sistema',
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, 2000);
        });
      },
      (error) => {
        console.log(error)
      }
    )

  }


  async CambiarContraseñaUsuarioInterno() {
    this.xAPI.funcion = "RECOSUP_R_UsuarioIdUsuarioInterno";
    this.xAPI.parametros = this.UsuarioId
    this.xAPI.valores = ''
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.forEach(e => {
          let FechaToken = e.FechaModifico
          const ConvertirFechaToken = new Date(FechaToken).getFullYear()
          setTimeout(() => {
            if (ConvertirFechaToken < 2023) {
              this._router.navigate(['user/profile']).then(() => { window.location.reload() });
              Swal.fire({
                position: 'top-end',
                icon: 'warning',
                html: 'Estimado Usuario <br>  Recomendamos Cambiar la Contraseña de Acceso al Sistema',
                showConfirmButton: false,
                timer: 3000
              })
            }
          }, 2000);
        });
      },
      (error) => {
        console.log(error)
      }
    )

  }


  async ListaEmpresasSimple() {
    this.xAPI.funcion = "RECOSUP_R_Empresas_Simple";
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ListaEmpresas = data.Cuerpo.map(e => {
          e.name = '(' + e.Rif + ') - ' + e.RazonSocial
          e.id = e.EmpresaId
          this.ListaEmpresas.push(e)
          return e
        });
        sessionStorage.setItem('Empresas', JSON.stringify(this.ListaEmpresas));
      },
      (error) => {
        console.log(error)
      }
    )
  }

}
