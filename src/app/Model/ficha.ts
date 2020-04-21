import * as Phaser from 'phaser';

export class Ficha extends Phaser.Physics.Arcade.Sprite {
    nombre: string;
    nivel: number;
    colocada: boolean;
    oculta: boolean;

    public constructor(scene: Phaser.Scene, frame: number, nombre: string, nivel: number, colocada: boolean, oculta: boolean) {
        super(scene, 0, 0, 'fichas',frame);
        this.scene = scene;
        this.nombre = nombre;
        this.nivel = nivel;
        this.colocada = colocada;
        this.oculta = oculta;

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        //this.body.immovable = true;
        var scale = this.scene.game.scale.width / this.width / 8 ;
        if (scale > (this.scene.game.scale.height / this.height / 8))
            scale = this.scene.game.scale.height / this.height / 8;

        this.setScale(scale);

        this.setCollideWorldBounds(true);

    }
}