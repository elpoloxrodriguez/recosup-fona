import { Injectable } from '@angular/core';



export interface IRol{
  nombre: string,
  descripcion: string,
  Modulo : IModulo[], 
}


export interface Aplicacion{
  id ?: string,
  nombre: string,
  url: string,
  comentario: string,
  version: string,
  autor: string,
  Rol ?: IRol
}

export interface IModulo{
  nombre : string,
  Menu   : Menu[]
}


export interface SubMenu{
  url: string,22
  js: string,
  icono: string,
  descripcion: string,
  nombre: string,
  accion: string,
  clase: string,
  color: string,
  Privilegios ?: Privilegios[]
  //SubMenu: []
}

export interface Menu{
  url: string,
  js: string,
  icono: string,
  descripcion: string,
  nombre: string,
  accion: string,
  clase: string,
  color: string,
  Privilegios ?: Privilegios[],
  SubMenu ?: SubMenu[]
}

export interface Privilegios{
  metodo: string,
  descripcion: string,
  accion: string,
  directivas: string
}



@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor() { }
}
