import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheet.sheet; charset=utf-8';
const EXCEL_EXT = '.xlsx'

@Injectable({
	providedIn: 'root'
})
export class ExcelService {

	constructor() { }

    exportToExcel(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = {
            Sheets: {'data': worksheet},
            SheetNames: ['data']
        };
        const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type:'array'})
        //  call method buffer and filename
        this.savesAsExcel(excelBuffer, excelFileName)
    }


    private savesAsExcel(buffer: any, fileName: string): void {
        const data : Blob = new Blob([buffer], {type: EXCEL_TYPE});
        FileSaver.saveAs(data, fileName + '-' + new Date().toLocaleDateString('es-VE', { weekday:"long", year:"numeric", month:"short", day:"numeric"})  + EXCEL_EXT);
    }


}
