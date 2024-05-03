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
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

import { colors } from 'app/colors.const';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})


export class DashboardComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;

  public regulares = []
  public irregulares = []
  public cUtilidadAporte = []
  public sUtilidadAporte = []

  public torta1 = []

  public currentYear: number


  public usuarios: number = 0
  public empresas: number = 0
  public recursos: number = 0
  public proyectos: number = 0

  public dobleaportante = []
  public ValorAltoAportante = []
  public aportante = []

  //
  public MontoRecaudacionAnioAnterior = []
  public MontoRecaudacionAnioActual = []
  // 



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
    labels: ['Utilidad y Aporte', 'Utilidad y sin Aporte', 'Regulares', 'Irregulares'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        label: `EMPRESAS DOBLE APORTANTES`,
      },
    ]
  }

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
    labels: ['MIF Pagas', 'MIF Revision', 'MIF Sin Pagar', 'MIF Rechazadas', 'ENI Pagas', 'ENI Sin Pagar'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        label: `TOTAL DE MULTAS`,
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
      scales: {
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            },
            ticks: {
              stepSize: 100000,
              min: 0,
              // max: this.ValorAltoAportante[0],
              fontColor: this.labelColor
            },
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
      },
      {
        data: this.aportante,
        label: `EMPRESAS APORTANTES`,
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
              stepSize: 1000000,
              min: 0,
              // max: 350000000,
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
        data: [],
        label: `METAS DEL AÑO 2023`,
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
        data: [],
        label: `METAS DEL AÑO 2024`,
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
      }
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
  public DataEmpresa = []
  public token
  public empresa = false
  public usuario = false
  public admin: boolean = false

  public ListaEmpresas: any = []

  public UsuarioId

  public tokenA

  public titleModal

  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public isLoading: number = 0
  // Inicio Lista de Empresas
  public ListaEmpresasAportes = []
  public rowsEmpresasAportes = []
  public tempDataEmpresasAportes = []
  // Final Lista de Empresas

  // Inicio Recursos Jerarquicos
  public dataListRecursosJerarquicos = []
  public rowsRecursosJerarquicos = []
  public tempDataRecursosJerarquicos = []
  // Fin Recursos Jerarquicos

  // Inicio Proyectos
  public MisProjects = []
  public rowsProyectos = []
  public tempDataMisProjects = []
  // Fin Proyectos


  public btnMetas: boolean = false
  public btnEmpresas: boolean = false
  public btnPanel01: boolean = false
  public btnTorta01: boolean = false
  public btnTorta02: boolean = false




  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private _router: Router,
    private modalService: NgbModal,
    private pdf: PdfService,
  ) {
    this.currentYear = new Date().getFullYear()
  }


  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    this.fecha = this.utilService.FechaMoment(new Date())
    this.token = jwt_decode(sessionStorage.getItem('token'));
    this.FechaModificoUsuario = this.token.Usuario[0].FechaModifico

    await this.Panel01()
    await this.Panel02()
    await this.Torta01()
    await this.Torta02()
    // await this.DataRecaudacionAnioAnterior(2023)
    await this.DataRecaudacionAnioActual()
    // this.CapacidadGraficos = 350000000



    this.IdEmpresa = this.token.Usuario[0].EmpresaId
    this.UsuarioId = this.token.Usuario[0].UsuarioId

    if (this.token.Usuario[0].EsAdministrador != 0) {
      await this.CambiarContraseñaUsuarioInterno()
    } else {
      await this.CambiarContraseñaEmpresa()
    }

    await this.EmpresaRIF(this.token.Usuario[0].Rif)
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
        this.DataEmpresa = data.Cuerpo
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async Panel01() {
    this.btnPanel01 = true
    this.xAPI.funcion = "RECOSUP_R_PanelPrincipal01";
    this.xAPI.parametros = ''
    this.xAPI.valores = {}
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.usuarios = data.Cuerpo[0].total_usuarios
        this.empresas = data.Cuerpo[0].total_empresas
        this.recursos = data.Cuerpo[0].total_recursos_jerarquicos
        this.proyectos = data.Cuerpo[0].total_proyectos
        this.btnPanel01 = false
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async Panel02() {
    this.btnEmpresas = true
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
        this.btnEmpresas = false
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async Torta01() {
    this.btnTorta01 = true
    this.xAPI.funcion = "RECOSUP_R_PanelTorta01";
    this.xAPI.parametros = `${this.currentYear - 1}`
    this.xAPI.valores = {}
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.btnTorta01 = false
        this.donusChart01 = {
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
          labels: ['Utilidad y Aporte', 'Utilidad y sin Aporte', 'Regulares', 'Irregulares'],
          datasets: [
            {
              data: [data.Cuerpo[0].utilidadConAporte, data.Cuerpo[0].utilidadSinAporte, data.Cuerpo[0].regulares ? data.Cuerpo[0].regulares : 0, data.Cuerpo[0].irregulares ? data.Cuerpo[0].irregulares : 0],
              label: `EMPRESAS DOBLE APORTANTES`,
            },
          ]
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }



  async Torta02() {
    this.btnTorta02 = true
    this.xAPI.funcion = "RECOSUP_R_PanelTorta02";
    this.xAPI.parametros = ''
    this.xAPI.valores = {}
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.btnTorta02 = false
        this.donusChart02 = {
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
          labels: ['MIF Pagas', 'MIF Revision', 'MIF Sin Pagar', 'MIF Rechazadas', 'ENI Pagas', 'ENI Sin Pagar'],
          datasets: [
            {
              data: [data.Cuerpo[0].MIF_Pagada ? data.Cuerpo[0].MIF_Pagada : 0, data.Cuerpo[0].MIF_Revision ? data.Cuerpo[0].MIF_Revision : 0, data.Cuerpo[0].MIF_SinPagas ? data.Cuerpo[0].MIF_SinPagas : 0, data.Cuerpo[0].MIF_Rechazados ? data.Cuerpo[0].MIF_Rechazados : 0, data.Cuerpo[0].ENI_Pagada ? data.Cuerpo[0].ENI_Pagada : 0, data.Cuerpo[0].ENI_SinPagar ? data.Cuerpo[0].ENI_SinPagar : 0],
              label: `EMPRESAS DOBLE APORTANTES`,
            },
          ]
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }



  async lstEmpresas(modal) {
    this.ListaEmpresasAportes = []
    this.rowsEmpresasAportes = []
    this.tempDataEmpresasAportes = []
    this.xAPI.funcion = "RECOSUP_R_Empresas_Aportes";
    this.xAPI.parametros = ''
    this.xAPI.valores = {}
    this.ListaEmpresasAportes = [];
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            e.EmpresaFiscalizada = e.status_bloqueo
            this.ListaEmpresasAportes.push(e);
          })
          this.rowsEmpresasAportes = this.ListaEmpresasAportes
          this.tempDataEmpresasAportes = this.rowsEmpresasAportes;
          this.isLoading = 1;
        } else {
          this.isLoading = 2;
        }
      },
      (error) => {
        console.log(error)
      }
    )
    this.titleModal = 'Lista de Empresas Inscritas'
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }
  filterUpdateE(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataEmpresasAportes.filter(function (d) {
      return d.RazonSocial.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsEmpresasAportes = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  async lstRecursosJerarquicos(modal) {
    this.dataListRecursosJerarquicos = []
    this.rowsRecursosJerarquicos = []
    this.tempDataRecursosJerarquicos = []
    this.xAPI.funcion = "RECOSUP_R_ActosRecurridos";
    this.xAPI.parametros = '';
    this.xAPI.valores = {}
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length > 0) {
          data.Cuerpo.map(e => {
            this.dataListRecursosJerarquicos.push(e)
          });
          this.rowsRecursosJerarquicos = this.dataListRecursosJerarquicos;
          this.tempDataRecursosJerarquicos = this.rowsRecursosJerarquicos;
          this.isLoading = 1;
        } else {
          this.isLoading = 2;
        }
      },
      (error) => {
        console.log(error)
      }
    )
    this.titleModal = 'Lista de Recursos Jerarquicos'
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }
  filterUpdateRJ(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataRecursosJerarquicos.filter(function (d) {
      return d.nombre_empresa.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsRecursosJerarquicos = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  async lstProyectos(modal) {
    this.MisProjects = []
    this.rowsProyectos = []
    this.tempDataMisProjects = []
    this.xAPI.funcion = "RECOSUP_R_Proyectos";
    this.xAPI.parametros = ""
    this.xAPI.valores = {}
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.fecha_proyecto = e.fecha_proyecto
          e.monto_inversionX = e.monto_inversion
          e.monto_inversion = this.utilService.ConvertirMoneda(e.monto_inversion)
          this.MisProjects.push(e)
        });
        this.rowsProyectos = this.MisProjects;
        this.tempDataMisProjects = this.rowsProyectos;
      },
      (error) => {
        console.log(error)
      }
    )
    this.titleModal = 'Lista de Proyectos'
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }
  filterUpdateMisProjects(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataMisProjects.filter(function (d) {
      return d.nombre_proyecto.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsProyectos = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }



  async DataRecaudacionAnioAnterior(fecha) {
    this.btnMetas = true
    this.xAPI.funcion = "RECOSUP_R_GestionMetasRecaudacion";
    this.xAPI.parametros = `${fecha}`
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(AnioAnterior => {
          this.btnMetas = false
          this.MontoRecaudacionAnioAnterior.push(this.utilService.RevertirConvertirMoneda(AnioAnterior.MontoTotal))
        })
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DataRecaudacionAnioActual() {
    try {
      this.btnMetas = true;
      this.xAPI.funcion = "RECOSUP_R_GestionMetasRecaudacionDual";
      this.xAPI.parametros = `${this.currentYear - 1},${this.currentYear}`;
      const data = await this.apiService.Ejecutar(this.xAPI).toPromise();

      const RecaudacionActual = data.Cuerpo.filter(e => e.Origen === "RecaudacionActual");
      RecaudacionActual.forEach(e => {
        this.lineChart.datasets[1].data.push(this.utilService.RevertirConvertirMoneda(e.MontoTotal))
      });

      const RecaudacionAnterior = data.Cuerpo.filter(e => e.Origen === "RecaudacionAnterior")
      RecaudacionAnterior.forEach(e => {
        this.lineChart.datasets[0].data.push(this.utilService.RevertirConvertirMoneda(e.MontoTotal))
      });

      this.btnMetas = false;
    } catch (error) {
      console.log(error);
    }
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
                  // var sdata = this.DataEmpresa
                  this.pdf.CertificadoInscripcion(this.DataEmpresa[0], xdata.contenido, this.CrearCert.token)
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
