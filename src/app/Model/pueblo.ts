import * as Phaser from 'phaser';
import {Edificio} from './edificio';


export class Pueblo  {
    nombre: string;
    construido: boolean = false;
    edificios: Edificio[];
    color:  Phaser.Display.Color;
    leva: number = 1;

    constructor(color: Phaser.Display.Color) {
        this.color = color;
    }

    iniciarTurno() {
        this.addLeva();
    }

    addLeva() {
        this.leva++;        
    }

}