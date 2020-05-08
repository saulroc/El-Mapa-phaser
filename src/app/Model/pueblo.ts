import * as Phaser from 'phaser';
import {Edificio} from './edificio';

var ini_edificios = [{
    nombre: 'ayuntamiento',
    posicion: -1,
    nivel: 1,
    oro: 2,
    madera: 0,
    piedra: 0,
    frame: 0
},
{
    nombre: 'almacen',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 1,
    piedra: 0,
    frame: 1
},
{
    nombre: 'cuartel',
    posicion: -1,
    nivel: 1,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 2
},
{
    nombre: 'estatua',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 0,
    piedra: 0,
    frame: 3
},
{
    nombre: 'biblioteca',
    posicion: -1,
    nivel: 1,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 4
},
{
    nombre: 'mercado',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 0,
    piedra: 0,
    frame: 5
},
{
    nombre: 'arqueria',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 2,
    piedra: 0,
    frame: 6
},
{
    nombre: 'atalaya',
    posicion: -1,
    nivel: 2,
    oro: 4,
    madera: 1,
    piedra: 0,
    frame: 7
},
{
    nombre: 'banco',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 8
},
{
    nombre: 'laboratorio',
    posicion: -1,
    nivel: 2,
    oro: 5,
    madera: 2,
    piedra: 0,
    frame: 9
},
{
    nombre: 'tesoreria',
    posicion: -1,
    nivel: 3,
    oro: 4,
    madera: 2,
    piedra: 1,
    frame: 10
},
{
    nombre: 'establos',
    posicion: -1,
    nivel: 3,
    oro: 5,
    madera: 2,
    piedra: 1,
    frame: 11
},
{
    nombre: 'coliseo',
    posicion: -1,
    nivel: 3,
    oro: 5,
    madera: 2,
    piedra: 1,
    frame: 12
},
{
    nombre: 'universidad',
    posicion: -1,
    nivel: 3,
    oro: 7,
    madera: 2,
    piedra: 1,
    frame: 13
},
{
    nombre: 'teatro',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 14
},
{
    nombre: 'armeria',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 0,
    piedra: 1,
    frame: 15
}]

export class Pueblo  {
    nombre: string;
    construido: boolean = false;
    edificios: any[];
    color:  Phaser.Display.Color;
    leva: number = 1;

    constructor(color: Phaser.Display.Color) {
        this.color = color;
        //ini_edificios.map(val => this.edificios.push(Object.assign({}, val)));
        this.edificios = JSON.parse(JSON.stringify(ini_edificios));
        
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
                return;
            }
        }
    }

    incrementarTropas() {
        this.leva++;        
    }

}