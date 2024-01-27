import { Injectable } from "@angular/core";
import { ApiService } from "../../../../@core/services/apicore/api.service";
import { UtilService } from "../../../../@core/services/util/util.service";

export interface Auditoria {
    id: string,
    usuario: any,
    ip ?: string,
    mac ?: string,
    funcion ?: string,
    parametro?: string,
    valoresN?: {},
    valoresV?: {},
    metodo ?: string,
    fecha: string,
}



@Injectable({
    providedIn: 'root'
})


export class InterfaceService {


    constructor(
      private utilservice : UtilService,
        private apiService: ApiService,
        
      ) { }

      

    async InsertarInformacionAuditoria(info: any) {
      let token = sessionStorage.getItem('token')
        var obj = {
          "coleccion": "auditoria-fona",
          "objeto": info,
          "donde": `{\"id\":\"${info.id}\"}`,
          "driver": "MGDBA",
          "upsert": true
        }
        await this.apiService.ExecColeccionAuditoria(obj,token).subscribe(
          (data) => {
            // this.utilservice.AlertMini('top-start','success',`Registro Exitoso`,3000)
          }, (error) => {
            // this.utilservice.AlertMini('top-end','error','Error al Guardadar los Datos de Auditoria',3000)
          }
        )
      }

}



