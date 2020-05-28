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
                if (this.tropas[i].movido < tropa.movido)
                    this.tropas[i].movido = tropa.movido;
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

    estaIniciandoMovimiento() {
        var resultado = true;

        this.tropas.forEach(tropa => {
            if (tropa.movido > 0)
                resultado = false;
        });
        return resultado;
    }

    mover() {
        if(this.estaIniciandoMovimiento()) {
            this.jugador.pelotonesMoviendo++;
        }
        this.tropas.forEach( tropa => tropa.movido++);
    }

    paralizar() {
        this.tropas.forEach( tropa => tropa.movido = tropa.movimiento);
    }

    iniciarTurno() {
        this.tropas.forEach( tropa => tropa.movido = 0);
    }

    obtenerVelocidadMaxima() {
        var velocidadMaxima = 0;
        this.tropas.forEach(tropa => {
            if(tropa.velocidad > velocidadMaxima)
                velocidadMaxima = tropa.velocidad;
        });

        return velocidadMaxima;
    }

    obtenerHeridasProvocadas(velocidad: number) {
        var heridas = 0;
        this.tropas.forEach(tropa => {
            if(tropa.velocidad == velocidad) {
                heridas += tropa.ataque * tropa.cantidad;
            }
        });
        return heridas;
    }

    /**
     * TODO: Calcular de manera inteligente el reparto de las heridas
     * @param heridas Heridas a repartir entre las tropas
     */
    repartirHeridasSufridas(heridas: number) {
        var puntosTropasMuertas: number = 0;
        var tropaMuerta: Tropa;
        
        var tropasOrdenadas = this.tropas.sort((a:Tropa, b:Tropa) => { 
            if (a.vida < b.vida || (a.vida == b.vida && a.nivel < b.nivel))
                return -1;
            
            return 1;
        });

        while (heridas > 0 && this.tropas.length > 0) {
            var tropaAHerir = tropasOrdenadas[0];
            var cantidadMuertos = Math.floor(heridas / tropaAHerir.vida);
            if (cantidadMuertos > tropaAHerir.cantidad) {
                cantidadMuertos = tropaAHerir.cantidad;
            }

            if (cantidadMuertos > 0) {
                heridas -= cantidadMuertos * tropaAHerir.vida;
                puntosTropasMuertas += cantidadMuertos * tropaAHerir.nivel;
                tropaMuerta = new Tropa(
                    tropaAHerir.tipo,
                    cantidadMuertos,
                    tropaAHerir.ataque,
                    tropaAHerir.vida,
                    tropaAHerir.movimiento,
                    tropaAHerir.movimiento,
                    tropaAHerir.velocidad,
                    tropaAHerir.distanciaDeAtaque
                );

                this.quitarTropa(tropaMuerta);

            } else {
                heridas = 0;
            }            
        }
        
        return puntosTropasMuertas;
        
    }
}