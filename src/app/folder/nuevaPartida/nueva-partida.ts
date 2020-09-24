import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Jugador } from '../../Model/jugador';


@Component({
    selector: 'nueva-partida',
    templateUrl: './nueva-partida.html'    
  })
export class NuevaPartida {
    public jugadores: Jugador[];

    constructor() { 
        this.jugadores = [];
        this.jugadores.push(new Jugador("Jugador 1", "", this.jugadores.length + 1, false));
        this.jugadores.push(new Jugador("Jugador 2", "", this.jugadores.length + 1, false));
    }

    ngOnInit() {

    }

    agregarJugador() {
        this.jugadores.push(new Jugador("nuevo jugador", "", this.jugadores.length + 1, false));
    }
}