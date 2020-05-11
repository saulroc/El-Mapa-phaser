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

        this.tropas.push(tropa);
    }
}