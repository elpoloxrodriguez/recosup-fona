import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConvertNumberService {
  units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  tens = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  hundreds = ['', 'ciento ', 'doscientos ', 'trescientos ', 'cuatrocientos ', 'quinientos ', 'seiscientos ', 'setecientos ', 'ochocientos ', 'novecientos'];

  convertNumberToWords(num: number): string {
    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);
    let words = this.convertIntegerToWords(integerPart);
    if (decimalPart >= 0) {
      words += ` Bolivares con ${decimalPart.toString().padStart(2, '0')}/100`;
    }
    return words;
  }

  convertIntegerToWords(num: number): string {
    if (num === 0) {
      return '';
    }
    if (num < 0) {
      return `menos ${this.convertIntegerToWords(Math.abs(num))}`;
    }
    let words = '';
    if (num < 10) {
      words += this.units[num];
    } else if (num < 20) {
      words += this.teens[num - 10];
    } else if (num < 100) {
      words += this.tens[Math.floor(num / 10)];
      const units = num % 10;
      if (units) {
        words += ` y ${this.units[units]}`;
      }
    } else if (num < 1000) {
      words += this.hundreds[Math.floor(num / 100)];
      const tens = num % 100;
      if (tens) {
        words += ` ${this.convertIntegerToWords(tens)}`;
      }
    } else if (num < 1000000) {
      words += this.convertIntegerToWords(Math.floor(num / 1000)) + ` mil`;
      const thousands = num % 1000;
      if (thousands) {
        words += ` ${this.convertIntegerToWords(thousands)}`;
      }
    } else if (num < 1000000000) {
      words += this.convertIntegerToWords(Math.floor(num / 1000000)) + ` millones`;
      const millions = num % 1000000;
      if (millions) {
        words += ` ${this.convertIntegerToWords(millions)}`;
      }
    }
    return words;
  }
}