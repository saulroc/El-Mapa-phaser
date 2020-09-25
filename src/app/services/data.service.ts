import { Injectable } from '@angular/core';
import { Partida } from '../Model/partida';
 
@Injectable({
  providedIn: 'root'
})
class DataService {
 
  private data = [];
  private partida: Partida;
 
  constructor() { }
 
  setData(id, data) {
    this.data[id] = data;
  }
 
  getData(id) {
    return this.data[id];
  }

  asignarPartida(partida: Partida)  {
      this.partida = partida;
  }
  obtenerPartida() {
      return this.partida;
  }
}

export const MyDataService = new DataService();