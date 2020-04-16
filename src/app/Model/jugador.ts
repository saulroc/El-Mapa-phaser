import * as Phaser from 'phaser';
import { Carta } from '../Model/carta';
import { Ficha } from '../Model/ficha';

export class Jugador extends Phaser.GameObjects.Sprite {
    nombre: string;
    CPU: boolean;
    mano: Carta[];
    fichasTerreno: Ficha[];
    activo: boolean;
    madera: number;
    oro: number;
    piedra: number;
    puntos: number;

    public constructor (scene: Phaser.Scene){
        super(scene, 0, 0, 'jugador');

        
    }

}