import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-project-evaluation',
  templateUrl: './project-evaluation.component.html',
  styleUrls: ['./project-evaluation.component.scss']
})
export class ProjectEvaluationComponent implements OnInit {

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
  public aX = []
  public b = 0
  public bX = []
  public c = 0
  public cX = []
  public d = 0
  public dX = []
  public e = 0
  public eX = []
  public f = 0
  public fX = []
  public g = 0
  public gX = []
  public h = 0
  public hX = []
  public i = 0
  public iX = []
  public j = 0
  public jX = []

  public totalA = 0
  public totalAX = []
  public totalB = 0
  public totalBX = []
  public totalC = 0
  public totalCX = []
  public totalD = 0
  public totalDX = []
  public totalE = 0
  public totalEX = []
  public totalF  = 0
  public totalFX = []
  public totalG = 0
  public totalGX = []
  public totalH = 0
  public totalHX = []
  public totalI = 0
  public totalIX = []
  public totalJ = 0
  public totalJX = []

  public rowTotalesEvaluacion = [
    {id:1, nomenclatura: 'A', nombre: 'Talleres Sencibilización e Información', total: this.totalA},
    {id:2, nomenclatura: 'B', nombre: 'Abordajes Preventivos Comunitarios', total: this.totalB},
    {id:3, nomenclatura: 'C', nombre: 'Reuniones Interinstitucionales', total: this.totalC},
    {id:4, nomenclatura: 'D', nombre: 'Jornadas Deportivas', total: this.totalD},
    {id:5, nomenclatura: 'E', nombre: 'Jornadas Culturales', total: this.totalE},
    {id:6, nomenclatura: 'F', nombre: 'Dotación de Kit Deportivo', total: this.totalF},
    {id:7, nomenclatura: 'G', nombre: 'Cines Foros', total: this.totalG},
    {id:8, nomenclatura: 'H', nombre: 'Escuelas Deportivas', total: this.totalH},
    {id:9, nomenclatura: 'I', nombre: 'Diagnosticos Comunitarios', total: this.totalI},
    {id:10, nomenclatura: 'J', nombre: 'Total Personas Atendidas', total: this.totalJ},
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
    { id: 7, name: "JULO" },
    { id: 8, name: "AGOSTO" },
    { id: 9, name: "SEPTIEMBRE" } ,
    { id: 10, name: "OCTUBRE" },
    { id: 11, name: "NOVIEMBRE" },
    { id: 12, name: "DICIEMBRE"}
    ]


    public rowMesesEvaluacion = [
      { id: 1, name: "ENERO", a: this.a, b:this.b, c:this.c }, 
      { id: 2, name: "FEBRERO", a: this.a, b:this.b, c:this.c   },
      { id: 3, name: "MARZO", a: this.a, b:this.b, c:this.c    },
      { id: 4, name: "ABRIL"  , a: this.a, b:this.b, c:this.c  },
      { id: 5, name: "MAYO" , a: this.a, b:this.b, c:this.c  },
      { id: 6, name: "JUNIO", a: this.a, b:this.b, c:this.c   },
      { id: 7, name: "JULO" , a: this.a, b:this.b, c:this.c  },
      { id: 8, name: "AGOSTO" , a: this.a, b:this.b, c:this.c  },
      { id: 9, name: "SEPTIEMBRE" , a: this.a, b:this.b, c:this.c  } ,
      { id: 10, name: "OCTUBRE", a: this.a, b:this.b, c:this.c   },
      { id: 11, name: "NOVIEMBRE"  , a: this.a, b:this.b, c:this.c },
      { id: 12, name: "DICIEMBRE", a: this.a, b:this.b, c:this.c  }
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
    private apiService : ApiService,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    await this.SeleccionTipoEvaluacion()
    await this.ListaEvaluacionProyectos()

    for (let i = 0; i <= this.mesActual; i++) {
      this.dataMeses.push(this.meses[i])
      this.MisProjects.push(this.rowMesesEvaluacion[i])
      this.rowsProyectos = this.MisProjects;
      this.tempDataMisProjects = this.rowsProyectos;
    }
    // console.log(this.MisProjects[0].name)
  }

  async ListaEvaluacionProyectos(){
    this.xAPI.funcion = "RECOSUP_R_EvaluacionProyectos";
    this.xAPI.parametros = ""
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
         switch (e.mes) {
          case "ENERO":
            console.log(e)
            this.a = e.cantidad
            break;
            case "FEBRERO":
            console.log(e)
            break;
            case "MARZO":
            console.log(e)
            break;
            case "ABRIL":
            console.log(e)
            break;
            case "MAYO":
            console.log(e)
            break;
            case "JUNIO":
            console.log(e)
            break;
            case "JULIO":
            console.log(e)
            break;
            case "AGOSTO":
            console.log(e)
            break;
            case "SEPTIEMBRE":
            console.log(e)
            break;
            case "OCTUBE":
            console.log(e)
            break;
            case "NOVIEMBRE":
            console.log(e)
            break;
            case "DICIEMBRE":
            console.log(e)
            break;
         
          default:
            break;
         }
          });
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

  async SeleccionTipoEvaluacion() {
    this.xAPI.funcion = "RECOSUP_R_ListaConexionEvaluacionProyectos";
    this.xAPI.parametros =""
    this.xAPI.valores = ""
    await this.apiService.Ejecutar(this.xAPI).subscribe(
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

  }


}
