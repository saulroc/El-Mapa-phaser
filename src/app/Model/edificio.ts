import { Tropa } from "./tropa";

export class Edificio {
    nombre: string;
    posicion: number;
    oro: number = 0;
    madera: number = 0;
    piedra: number = 0;
    nivel: number = 1;
    puntos: number = 1;
    numeroFrame: number = 0;
    generaOro: number = 0;
    tropa: Tropa;
    incrementoTropa: number = 0;
    incrementaComercio?: number = 0;

    /**
     *
     */
    constructor(nombre: string, posicion: number,nivel:number = 1, frame: number = 0, oro: number = 0, madera: number = 0, piedra: number = 0, puntos: number = 1, generaOro: number = 0, tropa: Tropa = null, incrementoTropa: number = 0, incrementaComercio: number = 0) {
        this.nombre = nombre;
        this.posicion = posicion;
        this.oro = oro;
        this.madera = madera;
        this.piedra = piedra;
        this.numeroFrame = frame;
        this.nivel = nivel;
        this.puntos = puntos;
        this.generaOro = generaOro;
        this.tropa = tropa;
        this.incrementoTropa = incrementoTropa;
        this.incrementaComercio = incrementaComercio;
    }

    sePuedeConstruir(oro:number, madera: number, piedra: number, posicion: number) {
        return this.oro <= oro 
            && this.madera <= madera 
            && this.piedra <= piedra
            && (this.nivel == 1 
                || (this.nivel == 2 && posicion > 3) 
                || (this.nivel == 3 && posicion > 6)
                || (this.nivel == 4 && posicion > 8));
    }

    estaConstruido() {
        return this.posicion >= 0;
    }

    incrementarTropa() {
        if(this.tropa)
            this.tropa.cantidad+= this.incrementoTropa;
    }

    decrementarTropa() {
        if(this.tropa && this.tropa.cantidad > 0)
            this.tropa.cantidad--;
    }
}