import * as Phaser from 'phaser';
import { Carta } from '../Model/carta';
import { Ficha } from '../Model/ficha';

export class Jugador extends Phaser.Physics.Arcade.Sprite {
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
        super(scene, 0, 0, 'jugador',0);

        this.scene = scene;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.immovable = true;

        this.setScale(this.scene.game.scale.width / this.width / 8 , this.scene.game.scale.height / this.height / 8);
    }

}