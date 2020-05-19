import { Pueblo } from "./pueblo";
import { Peloton } from "./peloton";
import { Tropa } from "./tropa";
import { Jugador } from "./jugador";


export class Ficha {
    nombre: string;
    nivel: number;
    colocada: boolean;
    oculta: boolean;
    frameNumero: number;
    pueblo: Pueblo;
    pelotones: Peloton[];
    minaMadera: boolean;
    minaPiedra: boolean;
    minaOro: boolean;
    minaTecnologia: number;
    tesoros: number;
    xTile: number;
    yTile: number;

    /**
     *
     */
    constructor(frame: number, nombre: string, nivel: number, colocada: boolean, oculta: boolean, pueblo: Pueblo = null, minaMadera: boolean = false, minaPiedra: boolean = false, minaOro: boolean = false, minaTecnologia: number = 0, tesoros: number = 0) {
        this.nombre = nombre;
        this.nivel = nivel;
        this.colocada = colocada;
        this.oculta = oculta;
        this.frameNumero = frame;
        this.minaMadera = minaMadera;
        this.minaPiedra = minaPiedra;
        this.minaOro = minaOro;
        this.minaTecnologia = minaTecnologia;
        this.tesoros = tesoros;
        this.pueblo = pueblo;
        this.pelotones = [];
        
    }

    addTropa(jugador: Jugador, tropa: Tropa) {
        for(var i = 0; i < this.pelotones.length; i ++) {
            if (this.pelotones[i].jugador == jugador) {
                this.pelotones[i].agregarTropa(tropa);
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
        var tropas: Tropa[] = [];
        tropas.push(nuevaTropa);
        this.addPeloton(jugador, tropas);

    }

    addPeloton(jugador: Jugador, tropas: Tropa[]) {
        var peloton = new Peloton(jugador, tropas);
        this.pelotones.push(peloton);
    }

    addTropas(jugador: Jugador, tropas: Tropa[]) {
        for (var i = 0; i < tropas.length; i ++) {
            this.addTropa(jugador, tropas[i]);
        }
    }

    deleteTropas(jugador: Jugador, tropas: Tropa[]) {        
        for (var i = 0; i < this.pelotones.length; i++) {
            var peloton = this.pelotones[i]
            if (jugador == peloton.jugador) {
                for(var j = 0; j < tropas.length; j++) {
                    peloton.quitarTropa(tropas[j]);
                }

                if (peloton.tropas.length == 0) {
                    this.pelotones.splice(i, 1);
                }
            }
        }
    }

    getPelotonesCombate() {
        if (this.pelotones.length > 1) 
            return this.pelotones;

        return null;
    }

    tieneMina() {
        return (this.minaMadera || this.minaPiedra || this.minaOro || this.minaTecnologia > 0);
    }

    sePuedeReclamar() {
        if (this.pelotones.length == 1 
            && this.pelotones[0].jugador
            && (this.tieneMina() || this.pueblo)) 
                return true;

        return false;
    }

    sePuedeReclamarTesoros(jugador: Jugador) {
        if (this.pelotones.length == 1 
            && this.pelotones[0].jugador
            && this.pelotones[0].jugador == jugador
            && this.tesoros > 0)
                return true;

        return false;
    }
}