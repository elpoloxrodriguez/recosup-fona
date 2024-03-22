import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket } from "rxjs/webSocket";

@Injectable({
  providedIn: 'root'
})


export class WsocketsService {
  wsk: any
  lst$ = new EventEmitter<any>();
  lst : []
  pid$: any
  lstpid$ = new EventEmitter<any>();
  estatusText$ = new EventEmitter<string>();
  estatusText: string = ''
  constructor() { 
    
  }
  instanciar(){
    this.wsk = webSocket("wss://localhost:3000/ws?id=panel")
  }


}
