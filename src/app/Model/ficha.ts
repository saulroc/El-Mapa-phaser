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
    rotacion: number;
    bloqueoNorte?: boolean;
    bloqueoSur?: boolean;
    bloqueoEste?: boolean;
    bloqueoOeste?: boolean;

    /**
     *
     */
    constructor(frame: number, nombre: string, nivel: number, colocada: boolean, oculta: boolean, pueblo: Pueblo = null, minaMadera: boolean = false, minaPiedra: boolean = false, minaOro: boolean = false, minaTecnologia: number = 0, tesoros: number = 0, bloqueoNorte: boolean = false, bloqueoSur: boolean = false, bloqueoEste: boolean = false, bloqueoOeste: boolean = false) {
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

        this.bloqueoNorte = bloqueoNorte;
        this.bloqueoSur = bloqueoSur;
        this.bloqueoEste = bloqueoEste;
        this.bloqueoOeste = bloqueoOeste;
        
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
            tropa.movido,
            );
        var tropas: Tropa[] = [];
        tropas.push(nuevaTropa);
        this.addPeloton(jugador, tropas);

    }

    addPeloton(jugador: Jugador, tropas: Tropa[]) {
        var peloton = new Peloton(jugador, tropas);
        this.pelotones.push(peloton);
        if (jugador !== null)
            jugador.pelotones.push(peloton);
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
                var copiaTropas = [];
                tropas.forEach(tropa => {
                    copiaTropas.push(tropa);
                });
                while( copiaTropas.length > 0) {
                    peloton.quitarTropa(copiaTropas.pop());
                }                

                if (peloton.tropas.length == 0) {
                    this.pelotones.splice(i, 1);
                    if (jugador !== null) {
                        var index = jugador.pelotones.findIndex(p => p === peloton);
                        jugador.pelotones.splice(index, 1);
                    }                    
                }

                return;
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

    reclamarTesoros(jugador: Jugador) {
        for (var i = 0; i< this.tesoros; i++) {
            var tipoRecursos = Phaser.Math.Between(1, 6);
            switch (tipoRecursos) {
                case 1: //oro
                case 2:
                case 3:
                    var cantidad = Phaser.Math.Between(1, 6);
                    jugador.setOro(cantidad);
                    break;
                case 4:
                case 5:
                    var cantidad = Phaser.Math.Between(1, 3);
                    jugador.setMadera(cantidad);
                    break;
                case 6:
                    var cantidad = Phaser.Math.Between(1, 2);
                    jugador.setPiedra(cantidad);
                    break;
                default:
                    break;
            }
        }
        this.tesoros = 0;
    }

    sePuedeMover(xTilePrueba:number, yTilePrueba:number) {
        
        if( this.bloqueoEste && this.xTile < xTilePrueba)
            return false;

        if(this.bloqueoOeste && this.xTile > xTilePrueba)
            return false;

        if(this.bloqueoNorte && this.yTile > yTilePrueba)
            return false;

        if(this.bloqueoSur && this.yTile < yTilePrueba)
            return false;

        return true;
    }

    rotarFicha() {
        var rotacion = Math.floor(Math.random() * 4) * 90;
        this.rotacion = rotacion;
        var anteriorBloqueoNorte = this.bloqueoNorte ? true : false;
        var anteriorBloqueoSur = this.bloqueoSur ? true : false;
        var anteriorBloqueoEste = this.bloqueoEste ? true : false;
        var anteriorBloqueoOeste = this.bloqueoOeste ? true : false;

        //Sentido a las agujas del reloj
        switch (rotacion) {
            case 90:
                this.bloqueoOeste = anteriorBloqueoSur;
                this.bloqueoSur = anteriorBloqueoEste;
                this.bloqueoEste = anteriorBloqueoNorte;
                this.bloqueoNorte = anteriorBloqueoOeste;
                break;
            case 180:
                this.bloqueoOeste = anteriorBloqueoEste;
                this.bloqueoSur = anteriorBloqueoNorte;
                this.bloqueoEste = anteriorBloqueoOeste;
                this.bloqueoNorte = anteriorBloqueoSur;
                break;
            case 270:
                this.bloqueoOeste = anteriorBloqueoNorte;
                this.bloqueoSur = anteriorBloqueoOeste;
                this.bloqueoEste = anteriorBloqueoSur;
                this.bloqueoNorte = anteriorBloqueoEste;
                
                break;
            
            default:
                break;
        }

    }
}