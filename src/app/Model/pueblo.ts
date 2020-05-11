import * as Phaser from 'phaser';
import {Edificio} from './edificio';
import { INI_EDIFICIOS } from './datosIniciales';



export class Pueblo  {
    nombre: string;
    construido: boolean = false;
    edificios: any[];
    color:  Phaser.Display.Color;
    leva: number = 1;
    oroGenera: number = 1;

    constructor(color: Phaser.Display.Color) {
        this.color = color;
        //ini_edificios.map(val => this.edificios.push(Object.assign({}, val)));
        this.edificios = JSON.parse(JSON.stringify(INI_EDIFICIOS));
        
    }

    iniciarTurno() {
        this.construido = false;
        this.incrementarTropas();
    }

    construirEdificio(posicion: number, nombreEdifico: string) {
        for (var i = 0; i < this.edificios.length; i++) {
            if (this.edificios[i].nombre == nombreEdifico) {
                this.edificios[i].posicion = posicion;
                this.construido = true;
                if (nombreEdifico == "banco" || nombreEdifico == "ayuntamiento") {
                    this.oroGenera++;
                } else if (nombreEdifico == "tesoreria") {
                    this.oroGenera += 2;
                }
                return;
            }
        }
    }

    incrementarTropas() {
        this.leva++;        
    }

}