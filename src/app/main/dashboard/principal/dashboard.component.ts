import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { ICrearCertificados } from '@core/services/empresa/empresa.service';
import { PdfService } from '@core/services/pdf/pdf.service';
import { UtilService } from '@core/services/util/util.service';
import jwt_decode from "jwt-decode";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  public xAPI: IAPICore = {
    funcion: '',
    parametros: '',
    valores: {},
  };

  public CrearCert: ICrearCertificados = {
    usuario: 0,
    token: '',
    type: 0,
    created_user: 0
  }
  
  public IdEmpresa
  public DataEmpresa
  public token
  public empresa = false
  public usuario = false

  constructor(
    private apiService: ApiService,
    private utilService: UtilService,
    private pdf: PdfService,
  ) { }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  async ngOnInit() {
    this.token =  jwt_decode(sessionStorage.getItem('token'));
    // console.log(this.token)
    this.IdEmpresa = this.token.Usuario[0].EmpresaId
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
        break;
        // case '9':
        //   this.usuario = false
        //   this.empresa = true
        //   break;
      default:
        this.usuario = false
        this.empresa = true
        break;
    }
  }

  async EmpresaRIF(id: any) {
    this.xAPI.funcion = "RECOSUP_R_empresa_rif";
    this.xAPI.parametros = id
    this.DataEmpresa = []
    await this.apiService.Ejecutar(this.xAPI).subscribe(
      (data) => {
          this.DataEmpresa.push(data.Cuerpo);
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
          let ruta: string = btoa('https://recosup.fona.gob.ve');
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


}
