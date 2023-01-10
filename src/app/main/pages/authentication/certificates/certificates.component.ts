import { Component, OnInit } from '@angular/core';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { CoreConfigService } from '@core/services/config.service';
import { IToken, LoginService } from '@core/services/seguridad/login.service';
import { UtilService } from '@core/services/util/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.scss']
})
export class CertificatesComponent implements OnInit {

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };
  
  public coreConfig: any;
  public iToken: IToken = { token: '', };
  public itk: IToken;
  public Qr

  constructor(
    private utilservice: UtilService,
    private apiService : ApiService,
    private _coreConfigService: CoreConfigService,
    private loginService: LoginService,

  ) { }

  ngOnInit(): void {
  }


  async Certificado(id: string){
    this.xAPI.funcion = "RECOSUP_R_Certificados";
    this.xAPI.parametros = id
     await this.apiService.EjecutarDev(this.xAPI).subscribe(
      (data) => {
        if (data.Cuerpo.length != 0) {
          this.Qr = ''
          console.log(data.Cuerpo[0])
          var cert = data.Cuerpo[0]
          Swal.fire({
            html: `
                  <div class="card card-congratulations">
                    <div class="card-body text-center">
                      <div class="avatar avatar-xl bg-primary shadow">
                      </div>
                      <div class="text-center">
                        <h1 class="mb-1 text-white">${cert.razon_social}</h1>
                        <p class="card-text m-auto w-50">
                        RIF: ${cert.rif}
                        </p>
                        <p class="card-text m-auto w-100">
                        DIRECCIÓN: ${cert.direccion}
                        </p>
                        <p class="card-text m-auto w-75">
                        ${cert.correo_empresa}  | ${cert.web}
                        </p>
                      </div>
                      <br>
                      <p align="right">
                      ${this.utilservice.FechaMoment(cert.fecha)}
                      </p>
                    </div>
                  </div>
            `,
            footer: `
                      <div class="auth-footer-btn d-flex justify-content-center">
                          <p class="text-center mt-2">
                            <small align="center">
                            <strong>Fondo Nacional Antidrogas - RIF: G-20009057-0</strong>
                            <br>Av. Francisco de Miranda, Edif. Centro Empresarial Metropolitano de Automoviles 407, PB. Oficina FONA, Los Ruices.
                           <br> E-MAIL:  <a href="mailto:recaudacion_fona@fona.gob.ve">recaudacion_fona@fona.gob.ve</a> - <a href="mailto:recaudacion_fona@fona.gob.ve">soporteypagos3234@gmail.com</a>
                            TELF: <a href="Tel:02122329541">0212-2329541</a> Ext: 8270-8271
                            </small>
                            </p>
                      </div>
            `,
            icon: 'success',
            width: '900px',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#3085d6',
          })
         } else {
          this.Qr = ''
          Swal.fire({
            title: 'Certificado NO Valido!',
            text: 'Lo sentimos, este certificado no es generado por nuestro sistema.',
            icon: 'error',
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
          })
         } 
      },
      (error) => {
        console.log(error)
      }
     )
  }

}
