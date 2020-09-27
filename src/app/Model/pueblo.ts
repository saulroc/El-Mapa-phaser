import * as Phaser from 'phaser';
import {EdificioSprite} from '../Sprites/edificioSprite';
import { INI_EDIFICIOS } from './datosIniciales';
import { Edificio } from './edificio';
import { Jugador } from './jugador';
import { Tropa, LEVA } from './tropa';



export class Pueblo  {
    nombre: string;
    construido: boolean = false;
    edificios: Edificio[];
    color: string;
    leva: Tropa;
    oroGenera: number = 1;
    comercio: number = 1;
    comerciado: number = 0;
    opcionesComercio: {oro:number, madera: number, piedra:number}[][];

    constructor(color: string) {
        this.comercio = 1;
        this.color = color;
        this.edificios = [];
        INI_EDIFICIOS.forEach(ini_edificio => {
            
            var edificio = new Edificio(ini_edificio.nombre,
                ini_edificio.posicion,
                ini_edificio.descripcion,
                ini_edificio.nivel,
                ini_edificio.numeroFrame,
                ini_edificio.oro,
                ini_edificio.madera,
                ini_edificio.piedra,
                ini_edificio.puntos,
                ini_edificio.generaOro,
                ini_edificio.tropa ? new Tropa(ini_edificio.tropa.tipo, 
                    ini_edificio.tropa.cantidad,
                    ini_edificio.tropa.movido) : null,
                ini_edificio.incrementoTropa,
                ini_edificio.incrementaComercio
                );
            this.edificios.push(edificio);
        })
        //this.edificios = JSON.parse(JSON.stringify(INI_EDIFICIOS));
        this.leva = new Tropa(LEVA, 1, 0);
        this.opcionesComercio =  [[{oro: 0, madera: 1, piedra: 0}, {oro: 1, madera: 0, piedra: 0}],
            [{oro: 0, madera: 0, piedra: 1}, {oro: 2, madera: 0, piedra: 0}],
            [{oro: 2, madera: 0, piedra: 0}, {oro: 0, madera: 1, piedra: 0}],
            [{oro: 3, madera: 0, piedra: 0}, {oro: 0, madera: 0, piedra: 1}]
        ];
    }

    iniciarTurno() {
        this.construido = false;
        this.comerciado = 0;
        var edificio = this.edificios.find(edificio => edificio.nombre == 'armeria');
        var aplicarArmeria = edificio ? edificio.estaConstruido() : false;
        this.incrementarTropas(aplicarArmeria);
        
        this.edificios.forEach(edificio => {
            if(edificio.estaConstruido())
                edificio.iniciarTurno(aplicarArmeria);
        })    
    }

    construirEdificio(posicion: number, nombreEdifico: string) {
        for (var i = 0; i < this.edificios.length; i++) {
            if (this.edificios[i].nombre == nombreEdifico) {
                this.edificios[i].posicion = posicion;
                this.construido = true;
                this.oroGenera += this.edificios[i].generaOro;
                this.comercio += this.edificios[i].incrementaComercio ? this.edificios[i].incrementaComercio : 0;
                return;
            }
        }
    }

    eliminarMaravilla(maravilla: Edificio) {
        var edificio = this.edificios.find(edificio => edificio.nombre == maravilla.nombre);
        if (!edificio.estaConstruido()) {
            var index = this.edificios.indexOf(edificio);
            this.edificios.splice(index,1);
        }
    }

    incrementarTropas(aplicarArmeria: boolean) {
        this.leva.cantidad++;  
        if (aplicarArmeria)  
            this.leva.cantidad++;        
    }

    getPuntos() {
        var puntos: number = 0;
        this.edificios.forEach(edificio => {
            if(edificio.estaConstruido())
                puntos += edificio.puntos;
        });

        return puntos;
    }

    getNumeroPelotonesMovibles() {
        var numero = 1;
        var edificio = this.edificios.find(value => value.nombre == 'almacen');
        if (edificio && edificio.estaConstruido())
            numero++;
        
        return numero;
    }

    hayEdificioEnLaPosicion(posicion) {
        for(var i =0; i < this.edificios.length; i++) {
            if (this.edificios[i].posicion == posicion)
                return true;
        }
        return false;
    }

    cumpleRequisitoNivel(posicion: number) {
        if (posicion < 4)
            return true;

        if (posicion >= 4 && posicion < 7 
            && this.hayEdificioEnLaPosicion(posicion - 3) 
            && this.hayEdificioEnLaPosicion(posicion - 4))
            return true;

        if (posicion >= 7 && posicion < 9
            && this.hayEdificioEnLaPosicion(posicion - 2) 
            && this.hayEdificioEnLaPosicion(posicion - 3))
            return true;

        if (posicion == 9 
            && this.hayEdificioEnLaPosicion(posicion - 1) 
            && this.hayEdificioEnLaPosicion(posicion - 2))
            return true

        return false;
    }

    puedeComerciar() {
        return this.comerciado < this.comercio;
    }

    puedeConstruir(jugador: Jugador) {
        var puedeConstruir = false;
        if (!jugador.tieneRecursos()) return false;
        
        if (!this.construido) {    
            this.edificios.forEach((edificio: Edificio) => {
                if (!edificio.estaConstruido()) {
                    var resultado = jugador.puedeComprar(edificio.oro, edificio.madera, edificio.piedra);
                    if (resultado) 
                        puedeConstruir = true;
                }
            });                             
        }

        return puedeConstruir;
    }

    puedeComprarTropas(jugador: Jugador) {
        if (!jugador.tieneRecursos()) return false;

        if (this.leva.cantidad > 0 && jugador.puedeComprar(this.leva.coste.oro, this.leva.coste.madera, this.leva.coste.piedra))
            return true;
        
        var edificiosConTropas = this.edificios.filter((e:Edificio) => e.estaConstruido() && e.tropa && e.tropa.cantidad >= 1);
        for(var edificio of edificiosConTropas) {
            var coste = edificio.tropa.coste;
            if (jugador.puedeComprar(coste.oro, coste.madera, coste.piedra))
                return true;
        }
        return false;
    }

    comerciar() {
        this.comerciado++;
    }


}