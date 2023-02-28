import { Injectable } from '@angular/core';
import { jsPDF } from "jspdf";
import { UtilService } from '../util/util.service';


@Injectable({
  providedIn: 'root'
})
export class PdfService {


  public comentario_title
  public porc_aporte
  public porc_aporte1
  public porc_aporte2
  public numero_formato
  public siglas_formato
  public comentario_text
  constructor(
    private utilService: UtilService,
  ) { }

  CertificadoDeclaracion(data: any,  Qr: any, TokenQr: any) {
    // console.log(data)
    let articulo
    const fecha = new Date(data.FechaDesde);
    const anioDeclaracion = fecha.getFullYear();
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE DECLARACIÓN FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);
    

    // if (data.ActividadEconomicaId == '11' || data.ActividadEconomicaId == '60') {
    //   this.porc_aporte1 = 'Art.34';
    //   this.porc_aporte = 'de la declaración de la Contribución Especial (Art.34)';
    //   this.porc_aporte2 = 'al Aporte del (2%)';
    //   this.siglas_formato = 'CDCE';
    //   this.numero_formato = '003';
    //   this.comentario_title = 'DE LA DECLARACIÓN DE LA CONTRIBUCIÓN ESPECIAL';
    // } else {
    //   this.porc_aporte1 = 'Art.32';
    //   this.porc_aporte = 'de la declaración del Aporte (Art.32)';
    //   this.porc_aporte2 = 'al Aporte del (1%)';
    //   this.siglas_formato = 'CDA';
    //   this.numero_formato = '002';
    //   this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
    // } if (data.FECHA_MODIFICO > data.FECHA_CREO) {
    //   this.comentario_text `y modificado en fecha ${data.FECHA_MODIFIC}`;
    // } else {
    //   this.comentario_text = '';
    // }

    switch (data.Articulo) {
      case '32':
      articulo = 'Art. 32'
      this.porc_aporte1 = 'Art.32';
      this.porc_aporte = 'de la declaración del Aporte (Art.32)';
      this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
      break;
      case '34':
        articulo = 'Art. 34'
        this.porc_aporte1 = 'Art.34';
        this.porc_aporte = 'de la declaración de la Contribución Especial (Art.34)';
        this.comentario_title = 'DE LA DECLARACIÓN DE CONTRIBUCIÓN ESPECIAL';
        break;  
      default:
        articulo = 'Art. 32'
        this.porc_aporte1 = 'Art.32';
        this.porc_aporte = 'de la declaración del Aporte (Art.32)';
        this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
        break;
    }

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(
      "REPÚBLICA BOLIVARIANA DE VENEZUELA",
      pageWidth / 2,
      pageHeight - 280,
      { align: "center" }
    );
    doc.text(
      "MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ",
      pageWidth / 2,
      pageHeight - 275,
      { align: "center" }
    );
    doc.text(
      "SUPERINTENDENCIA NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 270,
      { align: "center" }
    );
    doc.text(
      "FONDO NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 265,
      { align: "center" }
    );
    doc.setFont(undefined, "");


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${anioDeclaracion} -FONA-RECOSUP-${data.EmpresaId}-${data.EmpresaGananciaId}`, pageWidth - 40, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`CERTIFICADO ${ this.comentario_title +' ('+ this.porc_aporte1 +')' }  A TRAVÉS DEL SISTEMA DE REGISTRO Y CONTROL DE SUJETOS PASIVOS (RECOSUP).`, pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });


    doc.setFont(undefined, "");

    doc.setFontSize(14);
    doc.text(`El Director Ejecutivo del Fondo Nacional Antidrogas (FONA), conforme a lo dispuesto en el Artículo 148 del Código Orgánico Tributario, certifica la recepción de la DECLARACIÓN del contribuyente ${data.RazonSocial} RIF ${data.Rif}, realizada en fecha ${data.FECHA_CREO_GANANCIA}, por la cantidad de Bs. ${ this.utilService.ConvertirMoneda(data.MONTO) } , ante el Fondo Nacional Antidrogas, correspondiente al período desde ${data.FechaDesde} hasta el ${data.FechaHasta}.`,
      14,
      110,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("HECTOR JESUS BRITO ALVARADO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0155 G.O.Nº 42.233 de fecha 14/10/2021", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de la declaración a través del Sistema de Registro y Control de Sujetos Pasivos (RECOSUP). La emisión de este comprobante de declaración certifica la recepción del pago en las cuentas recaudadoras de esta Administración Tributaria.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );

    
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    doc.save("Certificado-de-Declaracion.pdf");
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Certificado.pdf' });
  }

  CertificadoInscripcion(data: any,  Qr: any, TokenQr: any) {
    let articulo = ''
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE INSCRIPCIÓN FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);


    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(
      "REPÚBLICA BOLIVARIANA DE VENEZUELA",
      pageWidth / 2,
      pageHeight - 280,
      { align: "center" }
    );
    doc.text(
      "MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ",
      pageWidth / 2,
      pageHeight - 275,
      { align: "center" }
    );
    doc.text(
      "SUPERINTENDENCIA NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 270,
      { align: "center" }
    );
    doc.text(
      "FONDO NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 265,
      { align: "center" }
    );
    doc.setFont(undefined, "");


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${data.EmpresaId}-FONA-RECOSUP-${TokenQr}`, pageWidth - 40, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("CERTIFICADO DE INSCRIPCIÓN ANTE EL FONDO NACIONAL ANTIDROGAS", pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });


    doc.setFont(undefined, "");
    doc.setFontSize(12);
    doc.text(`El Director Ejecutivo del Fondo Nacional Antidrogas (FONA), conforme a lo dispuesto en el Artículo 9 numeral 2 de la Providencia Administrativa 001-2015 de fecha 29 de julio de 2015, publicada en Gaceta Oficial N° 40.777 de fecha 29 de octubre de 2015, CERTIFICA la inscripción del Contribuyente: ${data.RazonSocial},Domicilio Fiscal: ${data.Direccion} (${data.Ciudad}),  identificado bajo el N° de R.I.F: ${data.Rif} , en el Sistema de Registro y Control de Sujetos Pasivos del FONA, según formulario electrónico N°: ${data.EmpresaId}-FONA-RECOSUP-${TokenQr}, procesado en fecha ${this.utilService.FechaMomentL(data.FechaCreo)}, siendo su actividad económica: ${data.ActividadEconomica}.`,
      14,
      110,
      { maxWidth: 185, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("HECTOR JESUS BRITO ALVARADO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0155 G.O.Nº 42.233 de fecha 14/10/2021", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de inscripción ante el Sistema de Registro y Control de Sujetos Pasivos del Fondo Nacional Antidrogas.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );


    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    doc.save("Certificado-de-Inscripcion.pdf");
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Certificado.pdf' });
  }

  GenerarCertificadoAportes(data: any,  Qr: any, TokenQr: any, dataRow: any) {
    // console.log(dataRow)
    // console.log(data)
    let articulo = ''
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE APORTE FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/sunad.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/fona.png', "PNG", 180, 10, 20, 25);
    doc.addImage(Qr, "PNG", 170, 255, 30, 30);
    

    // if (data.ActividadEconomica == 11 && data.ActividadEconomica == 60) {
    //   this.porc_aporte1 = 'Art.34';
    //   this.porc_aporte = 'de la declaración de la Contribución Especial (Art.34)';
    //   this.porc_aporte2 = 'al Aporte del (2%)';
    //   this.siglas_formato = 'CDCE';
    //   this.numero_formato = '003';
    //   this.comentario_title = 'DE LA DECLARACIÓN DE LA CONTRIBUCIÓN ESPECIAL';
    // } else {
    //   this.porc_aporte1 = 'Art.32';
    //   this.porc_aporte = 'de la declaración del Aporte (Art.32)';
    //   this.porc_aporte2 = 'al Aporte del (1%)';
    //   this.siglas_formato = 'CDA';
    //   this.numero_formato = '002';
    //   this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
    // } if (data.FECHA_MODIFICO > data.FECHA_CREO) {
    //   this.comentario_text `y modificado en fecha ${data.FECHA_MODIFIC}`;
    // } else {
    //   this.comentario_text = '';
    // }

    switch (dataRow.Articulo) {
      case '32':
      articulo = 'Art. 32'
      this.porc_aporte1 = 'Art.32';
      this.porc_aporte = 'de pago del Aporte (Art.32)';
      this.comentario_title = 'DE PAGO DEL APORTE';
      break;
      case '34':
        articulo = 'Art. 34'
        this.porc_aporte1 = 'Art.34';
        this.porc_aporte = 'de pago Contribución Especial (Art.34)';
        this.comentario_title = 'DE PAGO CONTRIBUCIÓN ESPECIAL';
        break;  
      default:
        articulo = 'Art. 32'
        this.porc_aporte1 = 'Art.32';
        this.porc_aporte = 'de pago del Aporte (Art.32)';
        this.comentario_title = 'DE LA DECLARACIÓN DEL APORTE';
        break;
    }

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(
      "REPÚBLICA BOLIVARIANA DE VENEZUELA",
      pageWidth / 2,
      pageHeight - 280,
      { align: "center" }
    );
    doc.text(
      "MINISTERIO DEL PODER POPULAR PARA RELACIONES INTERIORES, JUSTICIA Y PAZ",
      pageWidth / 2,
      pageHeight - 275,
      { align: "center" }
    );
    doc.text(
      "SUPERINTENDENCIA NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 270,
      { align: "center" }
    );
    doc.text(
      "FONDO NACIONAL ANTIDROGAS",
      pageWidth / 2,
      pageHeight - 265,
      { align: "center" }
    );
    doc.setFont(undefined, "");


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`N°: ${dataRow.FechaAporte} -FONA-RECOSUP-${dataRow.ReferenciaBancaria}`, pageWidth - 40, pageHeight - 250, { align: 'center' });


    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`CERTIFICADO ${ this.comentario_title +' ('+ this.porc_aporte1 +')' }  A TRAVÉS DEL SISTEMA DE REGISTRO Y CONTROL DE SUJETOS PASIVOS (RECOSUP).`, pageWidth / 2, pageHeight - 230, { maxWidth: 150, align: "center" });


    doc.setFont(undefined, "");

    doc.setFontSize(14);
    doc.text(`El Director Ejecutivo del Fondo Nacional Antidrogas (FONA), conforme a lo dispuesto en el Artículo 148 del Código Orgánico Tributario, certifica la recepción de la DECLARACIÓN del contribuyente ${data.RazonSocial} RIF ${data.Rif}, realizada en fecha ${dataRow.FechaCompletaAporte}, correspondiente al período fiscal ${dataRow.FechaAporte}  por la cantidad de Bs. ${ dataRow.Monto } , en el Banco ${dataRow.Banco}  bajo el numero de referencia #${dataRow.ReferenciaBancaria}, ante el Fondo Nacional Antidrogas, correspondiente al período desde ${this.utilService.FechaMomentL(dataRow.FechaDesde)} hasta el ${this.utilService.FechaMomentL(dataRow.FechaHasta)}.`,
      14,
      110,
      { maxWidth: 180, align: "justify" }
    );

    doc.setFontSize(12);
    doc.text("HECTOR JESUS BRITO ALVARADO", 105, 195, { align: "center" });
    doc.setFontSize(10);
    doc.text("Director Ejecutivo (FONA)", 105, 200, { align: "center" });
    doc.setFontSize(9);
    doc.text("Resolución Ministerial Nº 0155 G.O.Nº 42.233 de fecha 14/10/2021", 105, 205, { align: "center" });

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de pago contribución especial a través del Sistema de Registro y Control de Sujetos Pasivos (RECOSUP). La emisión de este comprobante de pago certifica la recepción del mismo en las cuentas recaudadoras de esta Administración Tributaria.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );

    
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text(TokenQr,
      175,
      285,
    );


    doc.save("Cerftificado-de-Aporte.pdf");
    doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Certificado.pdf' });
  }


  GenerarFichaResumenProyecto(data: any) {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "FICHA RESUMEN PROYECTO FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/fona.png', "PNG", 10, 10, 20, 25);
    // doc.addImage('assets/images/pdf/sunad.png', "PNG", 180, 10, 20, 25);
    
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`FICHA RESUMEN DEL PROYECTO`, pageWidth / 2, pageHeight - 275, { maxWidth: 150, align: "center" });


    


    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`FONA-GEP-FP-XXXX`, pageWidth - 180, pageHeight - 10, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text(`Atentamente:`, pageWidth - 90, pageHeight - 10, { align: 'center' });


    doc.save("Ficha.pdf");
    // doc.autoPrint();
    // doc.output("dataurlnewwindow", { filename: 'Ficha-Resumen-Proyecto.pdf' });

  }

  CertificadoPagoMIF(data: any){
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.setProperties({
      title: "CERTIFICADO DE PAGO MIF FONA-RECOSUP",
      subject: "https://github.com/elpoloxrodriguez",
      author: "SISTEMA  RECOSUP",
      keywords: "generated, javascript, web 2.0, ajax",
      creator: "CAP. ANDRÉS RICARDO RODRÍGUEZ DURÁN",
    });

    doc.addImage('assets/images/pdf/fona.png', "PNG", 10, 10, 20, 25);
    doc.addImage('assets/images/pdf/sunad.png', "PNG", 180, 10, 20, 25);
    
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text(`FONDO NACIONAL ANTIDROGAS`, pageWidth / 2, pageHeight - 275, { maxWidth: 150, align: "center" });
    doc.text(`FORMA FONA (F03)`, pageWidth / 2, pageHeight - 270, { maxWidth: 150, align: "center" });
    doc.text(`CERTIFICADO DE PAGO`, pageWidth / 2, pageHeight - 265, { maxWidth: 150, align: "center" });

    

    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Nota:",
      14,
      240,
      { maxWidth: 180, align: "justify" }
    );
    doc.setFontSize(9);
    doc.setFont(undefined, "");
    doc.text("Debe imprimir el presente certificado como comprobante de inscripción ante el Sistema de Registro y Control de Sujetos Pasivos del Fondo Nacional Antidrogas.",
      14,
      245,
      { maxWidth: 180, align: "justify" }
    );


    // doc.save("Ficha.pdf");
    doc.autoPrint();
    doc.output("dataurlnewwindow", { filename: 'Certificado de Pago MIF.pdf' });

  }
  
}
