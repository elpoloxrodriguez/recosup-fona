import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IPie, IRECOSUP_U_ActualizarMatriz } from '@core/services/empresa/empresa.service';
import { UtilService } from '@core/services/util/util.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import * as Chart from 'chart.js';



@Component({
  selector: 'app-admin-evaluation-project',
  templateUrl: './admin-evaluation-project.component.html',
  styleUrls: ['./admin-evaluation-project.component.scss']
})
export class AdminEvaluationProjectComponent implements OnInit {

  public UpdateMatriz : IRECOSUP_U_ActualizarMatriz = {
    anio: 0,
    tipoEvaluado: undefined,
    cantidad: 0,
    personas: 0,
    mesEvaluado: undefined
  };

  public VectorEval = []

  public chart: any;

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public selectedOption = 12;
  public ColumnMode = ColumnMode;

  @ViewChild(DatatableComponent) table: DatatableComponent;

  public fecha = new Date();
  public mes = this.fecha.getMonth() + 1;
  public anio = this.fecha.getFullYear();
  public  mesActual = new Date().getMonth()


  public a = 0
  public b = 0

  public rowTotalesEvaluacion = [
    {id:1, nomenclatura: 'A', nombre: 'Talleres Sensibilización e Información'},
    {id:2, nomenclatura: 'B', nombre: 'Abordajes Preventivos Comunitarios'},
    {id:3, nomenclatura: 'C', nombre: 'Reuniones Interinstitucionales'},
    {id:4, nomenclatura: 'D', nombre: 'Jornadas Deportivas'},
    {id:5, nomenclatura: 'E', nombre: 'Jornadas Culturales'},
    {id:6, nomenclatura: 'F', nombre: 'Dotación de Kit Deportivo'},
    {id:7, nomenclatura: 'G', nombre: 'Cines Foros'},
    {id:8, nomenclatura: 'H', nombre: 'Escuelas Deportivas'},
    {id:9, nomenclatura: 'I', nombre: 'Diagnosticos Comunitarios'},
    {id:10, nomenclatura: 'TOTAL', nombre: 'TOTAL PERSONAS ATENDIDAS'},
  ]

  public dataMeses = []
  public rowEvaluacion = []
  public meses = [
    { id: 1, name: "ENERO" }, 
    { id: 2, name: "FEBRERO" },
    { id: 3, name: "MARZO"  },
    { id: 4, name: "ABRIL"  },
    { id: 5, name: "MAYO" },
    { id: 6, name: "JUNIO" },
    { id: 7, name: "JULIO" },
    { id: 8, name: "AGOSTO" },
    { id: 9, name: "SEPTIEMBRE" } ,
    { id: 10, name: "OCTUBRE" },
    { id: 11, name: "NOVIEMBRE" },
    { id: 12, name: "DICIEMBRE"}
    ]

    public Cabecera = []
    public Cuerpo = []
    public Pie : IPie = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      g: 0,
      h: 0,
      i: 0,
      total: 0
    }

    public dataPie = []
    


    public rowMesesEvaluacion = [
      { id: 1, name: "ENERO"}, 
      { id: 2, name: "FEBRERO"  },
      { id: 3, name: "MARZO"   },
      { id: 4, name: "ABRIL"   },
      { id: 5, name: "MAYO"  },
      { id: 6, name: "JUNIO"  },
      { id: 7, name: "JULIO"  },
      { id: 8, name: "AGOSTO"  },
      { id: 9, name: "SEPTIEMBRE"  } ,
      { id: 10, name: "OCTUBRE"  },
      { id: 11, name: "NOVIEMBRE"  },
      { id: 12, name: "DICIEMBRE" }
      ]

    public TipoEvaluacion = []
    
    public searchValue = ''
    public MisProjects = []
    public rowsProyectos
    public tempDataMisProjects = []


    public mesEvaluado
    public tipoEvaluado
    public cantidad = 0
    public personas = 0

    

  constructor(
    private utilService : UtilService,
    private apiService : ApiService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.UpdateMatriz.anio = this.anio
    await this.CargarMatriz()
    this.SeleccionTipoEvaluacion()
    

    for (let i = 0; i <= this.mesActual; i++) {
      this.dataMeses.push(this.meses[i])
      this.MisProjects.push(this.rowMesesEvaluacion[i])
    }
    
    this.rowsProyectos = this.MisProjects;
    this.tempDataMisProjects = this.rowsProyectos;


  }


  Barras() {
    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        datasets: [{
          label: 'ACTIVIDADES PREVENTIVAS A NIVEL NACIONAL',
          data:  this.dataPie,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(225, 49, 32, 0.2)',
            'rgba(205, 0, 0, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(145,79,102,1)',
            'rgba(245,39,82,1)',
          ],
          borderWidth: 1.5
        }]
      },
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'top',
            formatter: (value) => {
              return value + '%';
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }



  CargarMatriz(){
    this.xAPI.funcion = "RECOSUP_R_ProyectosEvaluacionMatriz";
    this.xAPI.parametros = `${this.anio}`
    this.xAPI.valores = ""
     this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.Cabecera = data.Cabecera
        this.Cuerpo = data.Cuerpo
        this.ReiniciarPie()
        data.Cuerpo.forEach(e => {
          this.Pie.a += parseInt(e.a)
          this.Pie.b += parseInt(e.b)
          this.Pie.c += parseInt(e.c)
          this.Pie.d += parseInt(e.d)
          this.Pie.e += parseInt(e.e)
          this.Pie.f += parseInt(e.f)
          this.Pie.g += parseInt(e.g)
          this.Pie.h += parseInt(e.h)
          this.Pie.i += parseInt(e.i)
          this.Pie.total += parseInt(e.total)
        })
        this.dataPie.push(this.Pie.a)
        this.dataPie.push(this.Pie.b)
        this.dataPie.push(this.Pie.c)
        this.dataPie.push(this.Pie.d)
        this.dataPie.push(this.Pie.e)
        this.dataPie.push(this.Pie.f)
        this.dataPie.push(this.Pie.g)
        this.dataPie.push(this.Pie.h)
        this.dataPie.push(this.Pie.i)
        this.Barras()
        this.chart.data.datasets[0].data = this.dataPie
      },
      (error) => {
        console.log(error)
      }
    )
  }


  filterUpdateMisProjects(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempDataMisProjects.filter(function (d) {
      return d.mes.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.rowsProyectos = temp;
    this.table.offset = 0;
  }


  ModalAggEvaluacion(modal: any){
    this.mesEvaluado = this.mes
    this.modalService.open(modal,{
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

   SeleccionTipoEvaluacion() {
    this.xAPI.funcion = "RECOSUP_R_ListaConexionEvaluacionProyectos";
    this.xAPI.parametros =""
    this.xAPI.valores = ""
     this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.id = e.id_con,
          e.name = e.nombre
          this.TipoEvaluacion.push(e)
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  onSubmit(){
    let parametros = ''
    for (let i = 0; i < 9; i++) {
      if (i == this.UpdateMatriz.tipoEvaluado -1) {
        parametros +=this.UpdateMatriz.cantidad +','+ this.UpdateMatriz.personas +','
      } else {
        parametros += '0,0,'
      }
    }

    this.xAPI.funcion = "RECOSUP_U_ProyectoEvaluacionMatriz";
    this.xAPI.parametros = parametros + this.UpdateMatriz.anio +','+ this.UpdateMatriz.mesEvaluado.name
    console.log(this.xAPI.parametros)
    this.xAPI.valores = ""
     this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data)
        if (data.tipo === 1) {
          this.modalService.dismissAll('Close')
          this.utilService.alertConfirmMini('success','Ganancias Registradas Exitosamente') 
          this.CargarMatriz()
        } else {
          this.utilService.alertConfirmMini('error','Oops! Ocurrio un Error')
        }
      },
      (error) => {
        console.log(error)
      }
    )

  }

  ReiniciarPie(){
    this.Pie = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
      e: 0,
      f: 0,
      g: 0,
      h: 0,
      i: 0,
      total: 0
    }
  }



}