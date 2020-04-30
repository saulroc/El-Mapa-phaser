import * as Phaser from 'phaser';
import {Edificio} from './edificio';


export class Pueblo  {
    nombre: string;
    construido: boolean = false;
    edificios: Edificio[];
    color:  Phaser.Display.Color;

    constructor(color: Phaser.Display.Color) {
        this.color = color;
    }

}