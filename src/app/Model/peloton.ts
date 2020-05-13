import { Tropa } from "./tropa";
import { Jugador } from "./jugador";


export class Peloton {
    tropas: Tropa[];
    jugador: Jugador;

    /**
     *
     */
    constructor(jugador: Jugador, tropas: Tropa[] = []) {
        this.tropas = tropas;
        this.jugador = jugador;
    }

    agregarTropa(tropa: Tropa) {
        for(var i = 0; i < this.tropas.length; i++) {
            if (tropa.tipo == this.tropas[i].tipo) {
                this.tropas[i].cantidad += tropa.cantidad;
                return;
            }
        }
        var nuevaTropa = new Tropa(
            tropa.tipo, 
            tropa.cantidad,
            tropa.ataque,
            tropa.vida,
            tropa.movimiento,
            tropa.movido,
            tropa.velocidad,
            tropa.distanciaDeAtaque);
        this.tropas.push(nuevaTropa);
    }

    quitarTropa(tropa: Tropa) {
        for(var i = 0; i < this.tropas.length; i++) {
            if (tropa.tipo == this.tropas[i].tipo) {
                this.tropas[i].cantidad -= tropa.cantidad;
                if (this.tropas[i].cantidad <= 0) {
                    this.tropas.splice(i,1);
                }

                return;
            }
        }
    }

    puedeMover() {
        for (var i = 0; i < this.tropas.length; i++) {
            if (this.tropas[i].movimiento <= this.tropas[i].movido)
                return false;
        }

        return true;
    }

    mover() {
        this.tropas.forEach( tropa => tropa.movido++);
    }

    iniciarTurno() {
        this.tropas.forEach( tropa => tropa.movido = 0);
    }
}