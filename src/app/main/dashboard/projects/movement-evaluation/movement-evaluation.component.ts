import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService, IAPICore } from '@core/services/apicore/api.service';
import { NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '@core/services/pdf/pdf.service';
import jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '@core/services/util/util.service';
import { IDeclararUtilidad, IRECOSUP_C_Proyectos, IRECOSUP_I_EvaluacionMovimientos, IRECOSUP_U_ActualizarMatriz, RECOSUP_U_ProyectosUpdate } from '@core/services/empresa/empresa.service';
import { FlatpickrOptions } from 'ng2-flatpickr';
import Spanish from 'flatpickr/dist/l10n/es.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import {
  I18n,
  CustomDatepickerI18n
} from '@core/services/util/datapicker.service';
import { CoreConfigService } from '@core/services/config.service';
import { ConvertNumberService } from '@core/services/util/convert-number.service';
import { Console } from 'console';


@Component({
  selector: 'app-movement-evaluation',
  templateUrl: './movement-evaluation.component.html',
  styleUrls: ['./movement-evaluation.component.scss'],
  encapsulation : ViewEncapsulation.None,
  providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }, NgbModalConfig, NgbModal] // define custom NgbDatepickerI18n provider

})
export class MovementEvaluationComponent implements OnInit {

  public UpdateMatriz : IRECOSUP_U_ActualizarMatriz = {
    anio: 0,
    tipoEvaluado: undefined,
    cantidad: 0,
    personas: 0,
    mesEvaluado: undefined,
    estado: undefined,
    codigo_reverso: 0,
    status: 0
  };

  public IMovimientosEvaluacion : IRECOSUP_I_EvaluacionMovimientos = {
    mes: '',
    anio: '',
    codigo: '',
    estado: '',
    valor: 0,
    status: 0
  }

  public lstanios = [
    // {name: 2023},
    // {name: 2024}
  ]

  public Ianio

  public datosReversos
  public data: any;
  public selectedOption = 10;
  public ColumnMode = ColumnMode;

  

  public rows = []
  public searchValue = '';

  public ButtonShow = false;

  public movement = []

  public tempData = []

  public token
  public IdEmpresa
  public IdUser
  // decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(
    private utilService : UtilService,
    private apiService : ApiService,
    private modalService: NgbModal,
  ) { }

  public xAPI : IAPICore = {
    funcion: '',
    parametros: '',
    valores : {},
  };

  async ngOnInit() {
    this.token =  jwt_decode(sessionStorage.getItem('token'))
    this.IdEmpresa = this.token.Usuario[0].EmpresaId
    this.IdUser = this.token.Usuario[0].UsuarioId
    this.listarAniosDesde2022()
    this.Ianio = new Date().getFullYear();

    await this.ListMovement(this.Ianio)
  }
  
  /**
   * filterUpdate
   *
   * @param event
   */
      filterUpdate(event) {
        // Reset ng-select on search
        const val = event.target.value.toLowerCase();
        // Filter Our Data
        const temp = this.tempData.filter(function (d) {
          return d.mes.toLowerCase().indexOf(val) !== -1 || !val;
        });
        // Update The Rows
        this.rows = temp;
        // Whenever The Filter Changes, Always Go Back To The First Page
        this.table.offset = 0;
      }

      async ListMovement(anio) {
        this.xAPI.funcion = "RECOSUP_R_ListaMovimientoEvaluacion";
        this.xAPI.parametros = `${anio}`
        this.xAPI.valores = ""
        this.movement = []
         await this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            data.Cuerpo.map(e => {
              this.movement.push(e)
            });
            this.rows = this.movement;
            this.tempData = this.rows;
  
          },
          (error) => {
            console.log(error)
          }
        )
      }

     async ReversarMovimientos(val){
        this.datosReversos = val
        let valor = val.valor * -1
        this.UpdateMatriz.codigo_reverso = val.id
        this.UpdateMatriz.status = 1
        this.UpdateMatriz.cantidad = valor
        this.UpdateMatriz.anio = val.anio
        this.UpdateMatriz.estado = val.estado
        this.UpdateMatriz.mesEvaluado = val.mes
        this.UpdateMatriz.tipoEvaluado = val.codigo
        this.xAPI.funcion = "RECOSUP_I_MatrizMovimientos";
        this.xAPI.parametros = ''
        this.xAPI.valores = JSON.stringify(this.UpdateMatriz)
        this.movement = []
        await Swal.fire({
          title: 'Esta Seguro?',
          text: "De Reversar Este Movimiento!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, Reversarlo!',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
         this.apiService.Ejecutar(this.xAPI).subscribe(
          (data) => {
            if (data.tipo === 1) {
              // console.log(this.datosReversos)
              this.IMovimientosEvaluacion.id = this.datosReversos.id
              this.IMovimientosEvaluacion.mes = this.datosReversos.mes
              this.IMovimientosEvaluacion.anio = this.datosReversos.anio
              this.IMovimientosEvaluacion.codigo = this.datosReversos.codigo
              this.IMovimientosEvaluacion.estado = this.datosReversos.estado
              this.IMovimientosEvaluacion.status = 1
              this.IMovimientosEvaluacion.valor = this.datosReversos.valor
              // console.log(this.IMovimientosEvaluacion)
              this.utilService.alertConfirmMini('success','Movimiento Reversado Exitosamente') 
              this.xAPI.funcion = "RECOSUP_U_MovimientoEvaluacion";
              this.xAPI.parametros = ''
              this.xAPI.valores = JSON.stringify(this.IMovimientosEvaluacion)
              this.apiService.Ejecutar(this.xAPI).subscribe(
                (datax) => {
                  if (datax.tipo === 1) {
                  this.ListMovement(this.Ianio)
                  this.utilService.alertConfirmMini('success','Movimiento Reversado Exitosamente') 
                  }
                },(error) => {
                  this.utilService.alertConfirmMini('error','Oops! Ocurrio un Error')
                }
              )
            } else {
              this.utilService.alertConfirmMini('error','Oops! Ocurrio un Error')
            }
          },
          (error) => {
            console.log(error)
          }
        )
      }
    })
      }


      listarAniosDesde2022() {
        const anioActual = new Date().getFullYear();
        const anios = [];
        for (let i = 2022; i <= anioActual; i++) {
          const anio = {
            id: i,
            name: `${i}`
          };
          this.lstanios.push(anio);
        }
        return anios;
      }



}
