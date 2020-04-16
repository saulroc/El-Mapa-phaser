import * as Phaser from 'phaser';

export class Ficha extends Phaser.GameObjects.Sprite {
    nombre: string;
    nivel: number;
    colocada: boolean;
    oculta: boolean;

}