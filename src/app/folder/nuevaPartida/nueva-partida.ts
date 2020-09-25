import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Jugador } from '../../Model/jugador';
import { Partida } from '../../Model/partida'
import { DataService } from '../../services/data.service';

@Component({
    selector: 'nueva-partida',
    templateUrl: './nueva-partida.html'    ,
    providers: [DataService]
  })
export class NuevaPartida implements OnInit {
    public jugadores: Jugador[];
    private colores = ["#ff0000", "#0000ff", "#008000", "#ffff00", "#D2B48C", "#ff4500", "#800080", "#00ffff"]; 
    image: HTMLElement;

    constructor(private dataService: DataService, private router: Router) { 
        this.jugadores = [];
        this.jugadores.push(new Jugador("Jugador 1", this.colores[0], this.jugadores.length + 1, false));
        this.jugadores.push(new Jugador("Jugador 2", this.colores[1], this.jugadores.length + 1, false));
    }

    ngOnInit() {

    }

    imagenCargada(e) {
        this.image = e.detail.result;
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

    crearPartida() {
        var partida = new Partida();
        partida.iniciarJugadores(this.jugadores.map(j => Object.assign({}, {nombre: j.nombre, cpu: j.CPU, color: j.color})));
        this.dataService.asignarPartida(partida);
        this.router.navigate(['/folder/partida']);
    }
}