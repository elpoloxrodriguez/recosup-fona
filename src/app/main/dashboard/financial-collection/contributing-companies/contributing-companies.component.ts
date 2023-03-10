import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { Subject } from 'rxjs';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { IActualizarDatosEmpresa, ICrearCertificados, IDataEmpresaCompleta } from '@core/services/empresa/empresa.service';
import { UtilService } from '@core/services/util/util.service';
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";
import { PdfService } from '@core/services/pdf/pdf.service';


@Component({
  selector: 'app-contributing-companies',
  templateUrl: './contributing-companies.component.html',
  styleUrls: ['./contributing-companies.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [NgbModalConfig, NgbModal],
})
export class ContributingCompaniesComponent implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  public UpdateEmpresa: IActualizarDatosEmpresa = {
    UsuarioId: 0,
    Direccion: '',
    Telefono: '',
    Fax: '',
    ParroquiaId: undefined,
    ActividadEconomicaId: undefined,
    CorreoElectronico: '',
    Ciudad: '',
    Estado: '',
    CantidadEmpleados: '',
    Municipio: '',
    RazonSocial: ''
  }

  public MiEmpresa = []

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }

  public DataEmpresaCompleta: IDataEmpresaCompleta = {
    RazonSocial: '',
    Rif: '',
    Email: '',
    SitioWeb: '',
    Telefonos: '',
    FaxEmpresa: '',
    ActividadEconomica: '',
    estado: '',
    ciudad: '',
    municipio: '',
    parroquia: '',
    Direccion: '',
    FechaCierreFiscal: '',
    CantidadEmpleados: '',
    FechaRegistro: '',
    FechaAprobacion: '',
    RegistroMercantil: '',
    DocumentoFecha: '',
    DocumentoFolio: '',
    DocumentoProtocolo: '',
    DocumentoTomo: '',
    CodigoIvss: '',
    CedulaContacto: '',
    nombre: '',
    apellido: '',
    telefonoContacto: '',
    celularContacto: '',
    CorreoElectronico: '',
    TipoContacto: '',
    Usuario: '',
    Cedula: '',
    Nombres: '',
    Apellidos: '',
    TelefonoLocal: '',
    TelefonoCelular: '',
    CorreoPrincipal: '',
    CorreoSecundario: '',
    Cargo: ''
  }

  public ListaStatusEmpresa
  public titleModal
  public DataEmpresa
  public EmpresaUtilidadCierreFiscal
  public Utilidad
  public rowsUtilidadCierreFiscal
  public tempDataCierreFiscal
  public EmpresaDetalleMultas
  public rowsDetalleMultas
  public tempDataDetalleMultas
  public EmpresaDocumentosAdjuntos
  public rowsDocumentosAdjuntosEmpresa
  public tempDataDocumentosAdjuntosEmpresa


  public idEmpresaCert
  public idUsuarioCert

  public ShowFiscalizar = false

  public dataEmpresasAportes = [];
  public sidebarToggleRef = false;
  public rowsEmpresasAportes;
  public rowsDetalleAporte;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;
  public temp = [];
  public previousRoleFilter = '';
  public previousPlanFilter = '';
  public previousStatusFilter = '';

  public ListaEmpresasAportes = []

  public DataEmpresaAportes = []
  public EmpresaDetalleAportes = []

  public token
  public showUpdateEmpresa = false

  public searchValue = '';

  public selectActividadEconomica
  public selectEstados
  public selectMunicipios
  public selectParroquias

  
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;


  // Private
  private tempDataEmpresasAportes = [];
  private tempDataUtilidadAportes = []
  private _unsubscribeAll: Subject<any>;

  
  constructor(
    private apiService : ApiService,
    private modalService: NgbModal,
    private utilService: UtilService,
    private pdf: PdfService,

  ) {
    this._unsubscribeAll = new Subject();
  }

  async ngOnInit() {
    this.token = jwt_decode(sessionStorage.getItem('token'));
    if (this.token.Usuario[0].role == 9) {
      this.showUpdateEmpresa = true;
    } 
    if (this.token.Usuario[0].role == 3) {
      this.ShowFiscalizar = true
    }
   await  this.EmpresasAportes()
   await this.ListaParroquias()
   await this.ListaEstados()
   await this.ListaActividadEconomica()

  }

  async ListaActividadEconomica() {
    this.xAPI.funcion = "RECOSUP_R_ActividadEconomica";
    this.selectActividadEconomica = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectActividadEconomica = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.Codigo
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaEstados() {
    this.xAPI.funcion = "RECOSUP_R_Estados";
    this.selectEstados = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectEstados = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.EstadoId
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ListaMunicipios(id: string) {
    this.xAPI.funcion = "RECOSUP_R_Municipios";
    this.xAPI.parametros = id;
    this.selectMunicipios = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.selectMunicipios = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.MunicipioId
          return e
        });
      },
      (error) => {
        console.log(error)
      }
    )
  }


  async ListaParroquias() {
    this.xAPI.funcion = "RECOSUP_R_Parroquias";
    this.xAPI.parametros = '';
    this.selectParroquias = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        // console.log(data.Cuerpo)
        this.selectParroquias = data.Cuerpo.map(e => {
          e.name = e.Nombre
          e.id = e.ParroquiaId
          return e
        });
        // console.log(this.selectParroquias)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async EmpresasAportes() {
    this.xAPI.funcion = "RECOSUP_R_Empresas_Aportes";
    this.xAPI.parametros = ''
    this.dataEmpresasAportes = [];
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.EmpresaFiscalizada = 0
          this.ListaEmpresasAportes.push(e);
        })
            this.rowsEmpresasAportes = this.ListaEmpresasAportes
            this.tempDataEmpresasAportes = this.rowsEmpresasAportes;
            console.log(this.ListaEmpresasAportes)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  FiscalizarEmpresa(row : any){
    console.log(row)
    Swal.fire({
      title: 'Esta seguro?',
      html: `Desea Fiscalizar la Empresa! <br> <font color='red'><strong>${row.RazonSocial}</strong></font> <br> Tenga en cuenta que la misma estar??  <font color='red'><strong>INHABILITADA</strong></font> para los demas modulos del sistema`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Fiscalizarla!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Felicidades!',
          `<font color='red'><strong>${row.RazonSocial}</strong></font> <br> se encuenta Fiscalizada`,
          'success'
        )
      }
    })
  }

  async GuardarActualizacionDatosEmpresas() {
    this.UpdateEmpresa.UsuarioId = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = 'RECOSUP_U_MiEmpresa'
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.UpdateEmpresa)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          this.modalService.dismissAll('Cerrar')
          this.utilService.alertConfirmMini('success', 'Datos actualizados exitosamente')
          // Actualizamos la tabla
        } else {
          this.utilService.alertConfirmMini('error', 'Oops! Algo salio mal, intente de nuevo!')
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "RECOSUP_R_empresa_rif";
    this.xAPI.parametros = id
    this.DataEmpresa = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.length
        data.Cuerpo.map(e => {
          this.DataEmpresaCompleta.RazonSocial = e.RazonSocial
          this.DataEmpresaCompleta.Rif = e.Rif
          this.DataEmpresaCompleta.Email = e.CorreoEmpresa
          this.DataEmpresaCompleta.SitioWeb = e.PaginaWeb
          this.DataEmpresaCompleta.Telefonos = e.TelefonoEmpresa + ' | ' + e.TelefonoLocal
          this.DataEmpresaCompleta.FaxEmpresa = e.FaxEmpresa
          this.DataEmpresaCompleta.ActividadEconomica = e.ActividadEconomica
          this.DataEmpresaCompleta.estado = e.Estado
          this.DataEmpresaCompleta.ciudad = e.Ciudad
          this.DataEmpresaCompleta.municipio = e.Municipio
          this.DataEmpresaCompleta.parroquia = e.Parroquia
          this.DataEmpresaCompleta.Direccion = e.Direccion
          this.DataEmpresaCompleta.FechaCierreFiscal = e.FechaCierreFiscal
          this.DataEmpresaCompleta.CantidadEmpleados = e.CantidadEmpleados
          this.DataEmpresaCompleta.FechaAprobacion = e.FechaAprobo
          this.DataEmpresaCompleta.FechaRegistro = e.FechaCreo
          this.DataEmpresaCompleta.RegistroMercantil = e.Notaria
          this.DataEmpresaCompleta.DocumentoFecha = e.DocumentoFecha
          this.DataEmpresaCompleta.DocumentoFolio = e.DocumentoFolio
          this.DataEmpresaCompleta.DocumentoProtocolo = e.DocumentoProtocolo
          this.DataEmpresaCompleta.DocumentoTomo = e.DocumentoTomo
          this.DataEmpresaCompleta.CodigoIvss = e.CodigoIvss
          this.DataEmpresaCompleta.CedulaContacto = e.CedulaContacto
          this.DataEmpresaCompleta.nombre = e.Nombre
          this.DataEmpresaCompleta.apellido = e.Apellido
          this.DataEmpresaCompleta.telefonoContacto = e.Telefono
          this.DataEmpresaCompleta.celularContacto = e.Celular
          this.DataEmpresaCompleta.CorreoElectronico = e.CorreoElectronico
          this.DataEmpresaCompleta.TipoContacto = e.TipoContacto
          this.DataEmpresaCompleta.Usuario = e.Codigo
          this.DataEmpresaCompleta.Cedula = e.Cedula
          this.DataEmpresaCompleta.Nombres = e.Nombres
          this.DataEmpresaCompleta.Apellidos = e.Apellidos
          this.DataEmpresaCompleta.TelefonoLocal = e.TelefonoLocal
          this.DataEmpresaCompleta.TelefonoCelular = e.TelefonoCelular
          this.DataEmpresaCompleta.CorreoPrincipal = e.CorreoPrincipal
          this.DataEmpresaCompleta.CorreoSecundario = e.CorreoSecundario
          this.DataEmpresaCompleta.Cargo = e.Cargo
          this.DataEmpresa.push(e);
        });
        // console.log(this.DataEmpresa)
      },
      (error) => {
        console.log(error)
      }
    )
  }



  async GenerarCertificadoInscripcion() {
    this.CrearCert.usuario = this.idUsuarioCert
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 1, // 1 INSCRIPCI??N
      this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = "RECOSUP_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://recosup.fona.gob.ve');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DataEmpresa[0]
                  this.pdf.CertificadoInscripcion(sdata, xdata.contenido, this.CrearCert.token)
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

  async GenerarCertificadoDeclaracion(data: any) {
    var EmpresaID = this.idEmpresaCert
    var Fecha = data.Fecha
    this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.CrearCert.usuario = this.idUsuarioCert
    this.CrearCert.type = 2, // 2 QR DECLARACION
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
    this.xAPI.funcion = "RECOSUP_R_CertificadoDeclaracion";
    this.xAPI.parametros = EmpresaID + ',' + Fecha
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (dataCertificados) => {
        var id = 'RIfEmpresa'
        let ruta: string = btoa('https://recosup.fona.gob.ve');
        this.apiService.GenQR(id, ruta).subscribe(
          (data) => {
            this.apiService.LoadQR(id).subscribe(
              (xdata) => {
                this.xAPI.funcion = "RECOSUP_C_Certificados";
                this.xAPI.parametros = ''
                this.xAPI.valores = JSON.stringify(this.CrearCert)
                this.apiService.Ejecutar(this.xAPI).subscribe(
                  (data) => {
                    this.pdf.CertificadoDeclaracion(dataCertificados.Cuerpo[0], xdata.contenido, this.CrearCert.token)
                    this.utilService.alertConfirmMini('success', 'Certificado Descagado Exitosamente')
                  },
                  (err) => {
                    this.utilService.alertConfirmMini('error', 'Lo sentimos algo salio mal, intente de nuevo')
                  }
                )
              },
              (error) => {
                console.log(error)
              }
            )
          }
        )
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async GenerarCertificadoAportes(dataRow: any) {
    this.CrearCert.usuario = this.idUsuarioCert
    this.CrearCert.token = this.utilService.TokenAleatorio(10),
      this.CrearCert.type = 3, // 3 QR APORTES
      this.CrearCert.created_user = this.token.Usuario[0].UsuarioId
    this.xAPI.funcion = "RECOSUP_C_Certificados";
    this.xAPI.parametros = ''
    this.xAPI.valores = JSON.stringify(this.CrearCert)
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        if (data.tipo === 1) {
          var id = this.CrearCert.token
          let ruta: string = btoa('https://recosup.fona.gob.ve');
          this.apiService.GenQR(id, ruta).subscribe(
            (data) => {
              // INSERT API
              this.apiService.LoadQR(id).subscribe(
                (xdata) => {
                  var sdata = this.DataEmpresa[0]
                  this.pdf.GenerarCertificadoAportes(sdata, xdata.contenido, this.CrearCert.token, dataRow)
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

  async UtilidadCierreFiscal(id: any) {
    this.xAPI.funcion = "RECOSUP_R_utilidad_cierre_fiscal";
    this.xAPI.parametros = id
    this.EmpresaUtilidadCierreFiscal = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.Utilidad = data.Cuerpo.map(e => {
          e.ejercicioFiscal = e.FechaDesde + ' | ' + e.FechaHasta
          e.Diferencia = this.utilService.diferenciaFecha(e.FechaHasta, e.FechaCreo)
          return e
          // this.Utilidad.push(e)
        });
        this.rowsUtilidadCierreFiscal = this.Utilidad;
        this.tempDataCierreFiscal = this.rowsUtilidadCierreFiscal;
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DetalleAportes(id: any) {
    this.xAPI.funcion = "RECOSUP_R_Detalle_aportes";
    this.xAPI.parametros = id
    this.EmpresaDetalleAportes = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          e.ejercicioFiscal = e.FechaDesde + ' | ' + e.FechaHasta
          this.EmpresaDetalleAportes.push(e);
        });
        this.rowsDetalleAporte = this.EmpresaDetalleAportes;
        this.tempDataUtilidadAportes = this.rowsDetalleAporte
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DetalleMultas(id: any) {
    this.xAPI.funcion = "RECOSUP_R_detalle_multas_empresa";
    this.xAPI.parametros = id
    this.EmpresaDetalleMultas = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.EmpresaDetalleMultas.push(e);
        });
        this.rowsDetalleMultas = this.EmpresaDetalleMultas;
        this.tempDataDetalleMultas = this.rowsDetalleMultas
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async DocumentosAdjuntosEmpresa(usuario: any, empresa: any) {
    var idd = empresa
    var usua = usuario
    this.xAPI.funcion = "RECOSUP_R_DocumentosAdjuntos_Empresas";
    this.xAPI.parametros = idd + ',' + usua;
    this.EmpresaDocumentosAdjuntos = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        data.Cuerpo.map(e => {
          this.EmpresaDocumentosAdjuntos.push(e);
        });
        // setTimeout(() => {
        this.rowsDocumentosAdjuntosEmpresa = this.EmpresaDocumentosAdjuntos;
        this.tempDataDocumentosAdjuntosEmpresa = this.rowsDocumentosAdjuntosEmpresa
        //  }, 450);
        // console.log(this.EmpresaDocumentosAdjuntos)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  async ModalEditarEmpresaX(){
    const sel =[ {
      apples: 'Apples',
      bananas: 'Bananas',
      grapes: 'Grapes',
      oranges: 'Oranges'
    }]
    this.xAPI.funcion = "RECOSUP_R_Listar_Estatus_Empresa";
    this.xAPI.parametros = ''
    this.ListaStatusEmpresa = [];
     await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
        this.ListaStatusEmpresa = [data.Cuerpo]
      },
      (error) => {
        console.log(error)
      }
    )
    const { value: fruit } = await Swal.fire({
      title: 'Seleccione Status',
      input: 'select',
      inputOptions: this.ListaStatusEmpresa.Estatus,
      inputPlaceholder: 'Seleccione Status',
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value === '') {
            resolve('Necesitas Seleccionar un Status')
          } else {
            Swal.fire(`Exitoso: ${value}`)
          }
        })
      }
    })
  }

  ModalEditarEmpresa(modal,row) {
    // console.log(row)
    this.UpdateEmpresa.RazonSocial = row.RazonSocial
    this.UpdateEmpresa.CorreoElectronico = row.CorreoEmpresa
    this.UpdateEmpresa.Telefono = row.TelefonoEmpresa
    this.UpdateEmpresa.Fax = row.FaxEmpresa
    this.UpdateEmpresa.ActividadEconomicaId = row.ActividadEconomicaId
    this.UpdateEmpresa.Estado = row.Estado
    this.UpdateEmpresa.Ciudad = row.Ciudad
    this.UpdateEmpresa.Municipio = row.Municipio
    this.UpdateEmpresa.ParroquiaId = row.ParroquiaId
    this.UpdateEmpresa.Direccion = row.Direccion
    this.UpdateEmpresa.CantidadEmpleados = row.CantidadEmpleados
    this.modalService.open(modal, {
      centered: true,
      size: 'lg',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });   
  }

  filterUpdateUtilidadAportes(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataCierreFiscal.filter(function (d) {
      return d.FechaAporte.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsUtilidadCierreFiscal = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateUtilidadCierreFiscal(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataCierreFiscal.filter(function (d) {
      return d.Fecha.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsUtilidadCierreFiscal = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdateDetalleMultas(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDetalleMultas.filter(function (d) {
      return d.Anio.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDetalleMultas = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  dwUrl(ncontrol: string, archivo: string): string {
    return this.apiService.Dws(btoa("D" + ncontrol) + '/' + archivo)
  }

  async DetalleEmpresa(modal, data) {
    this.idEmpresaCert = data.EmpresaId
    this.idUsuarioCert = data.UsuarioId
    await this.EmpresaRIF(data.Rif)
    await this.UtilidadCierreFiscal(data.EmpresaId)
    await this.DetalleAportes(data.EmpresaId)
    await this.DetalleMultas(data.EmpresaId)
     await this.DocumentosAdjuntosEmpresa(data.UsuarioId,data.EmpresaId)
    this.titleModal = data.RazonSocial
    this.modalService.open(modal, {
      centered: true,
      size: 'xl',
      backdrop: false,
      keyboard: false,
      windowClass: 'fondo-modal',
    });
  }

  filterUpdateDocumentoAdjuntoEmpresa(event) {
    // Reset ng-select on search
    const val = event.target.value.toLowerCase();
    // Filter Our Data
    const temp = this.tempDataDocumentosAdjuntosEmpresa.filter(function (d) {
      return d.fech.toLowerCase().indexOf(val) !== -1 || !val;
    });
    // Update The Rows
    this.rowsDocumentosAdjuntosEmpresa = temp;
    // Whenever The Filter Changes, Always Go Back To The First Page
    this.table.offset = 0;
  }

  filterUpdate(event) {
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

  /**
   * On destroy
   */
   ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


}

