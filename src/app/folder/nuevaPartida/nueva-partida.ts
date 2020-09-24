import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Jugador } from '../../Model/jugador';


@Component({
    selector: 'nueva-partida',
    templateUrl: './nueva-partida.html'    
  })
export class NuevaPartida {
    public jugadores: Jugador[];
    private colores = ["0xff0000", "0x0000ff", "0x008000", "0xffff00", "0xD2B48C", "0xff4500", "0x800080", "0x00ffff"]; 

    constructor() { 
        this.jugadores = [];
        this.jugadores.push(new Jugador("Jugador 1", this.colores[0], this.jugadores.length + 1, false));
        this.jugadores.push(new Jugador("Jugador 2", this.colores[1], this.jugadores.length + 1, false));
    }

    ngOnInit() {

    }

    agregarJugador() {
        if(this.jugadores.length < this.colores.length)
            this.jugadores.push(new Jugador("nuevo jugador", this.colores[this.jugadores.length], this.jugadores.length + 1, false));
    }
    quitarJugador() {
        if (this.jugadores.length > 2)
            this.jugadores.pop();
    }
    cambiarCPU(jugador: Jugador) {
        jugador.CPU = !jugador.CPU;
    }
}