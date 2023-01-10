import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class UtilService {


  //
  constructor(
  ) {

  }


  /**
   * Fecha Actual del sistema desde la application
   * @param dias sumar dias a la fecha actual 
   * @returns retorna la fecha actual del sistema en formato YYYY-MM-DD
   */
  FechaActual(dias : number = 0): string {
    let date = new Date()

    if (dias > 0) date.setDate(date.getDate() + dias)

    let output = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    return output
  }
  //retorna fecha en formato Dia/Mes/Anio
  ConvertirFecha(fecha: any): string {
    return fecha.year + '-' + + fecha.month + '-' + fecha.day
  }

  FechaMoment(fecha: any){
    moment.locale('es')
    var fech = moment(fecha).format('LLLL')
    return fech
  }

  FechaMomentL(fecha: any){
    moment.locale('es')
    var fech = moment(fecha).format('L')
    return fech
  }

  FechaMomentLLL(fecha: any){
    moment.locale('es')
    var fech = moment(fecha).format('L')
    return fech
  }

  TokenAleatorio(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
   }
   return result;
}

  ConvertirMoneda(moneda: any) {
    const formatter = new Intl.NumberFormat('es-VE', { style: 'currency', currency: 'VEF' }).format(moneda)
    return formatter
  }

  RevertirConvertirMoneda(moneda: any) {
    let TotalDevengado = moneda.replace(/,/g, "");
    return TotalDevengado
  }

  alertConfirmMini(icon,title){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: icon,
      title: title
    })
  }



  Semillero(id: string): string {
    var f = new Date()
    var anio = f.getFullYear().toString().substring(2, 4)
    var mes = this.zfill((f.getMonth() + 1).toString(), 2)
    var dia = this.zfill(f.getDate().toString(), 2)
    return anio + mes + dia + '-' + this.zfill(id, 5)
  }

  public zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */
    var zero = "0"; /* String de cero */

    if (width <= length) {
      if (number < 0) {
        return ("-" + numberOutput.toString());
      } else {
        return numberOutput.toString();
      }
    } else {
      if (number < 0) {
        return ("-" + (zero.repeat(width - length)) + numberOutput.toString());
      } else {
        return ((zero.repeat(width - length)) + numberOutput.toString());
      }
    }


  }

  //convertir cadena a minuscula y sin carateres especiales
  ConvertirCadena(cadena: string): string {
    return cadena.toLowerCase().replace(/á/g, "a").replace(/ê/g, "i").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u")
  }



diferenciaFecha(fecha1: string, fecha2: string){
let fecha = moment(fecha2).diff(fecha1, 'days')
return fecha
}

}
