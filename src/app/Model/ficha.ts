import * as Phaser from 'phaser';
import { Pueblo } from './pueblo';
import { PuebloSceneService } from '../services/pueblo-scene.service';

export class Ficha extends Phaser.Physics.Arcade.Sprite {
    nombre: string;
    nivel: number;
    colocada: boolean;
    oculta: boolean;
    frameNumero: number;
    pueblo: Pueblo;
    tropas: any;
    minaMadera: any;
    minaPiedra: any;
    tesoros: any;
    marcador: Phaser.GameObjects.Sprite;

    public constructor(scene: Phaser.Scene, frame: number, nombre: string, nivel: number, colocada: boolean, oculta: boolean, pueblo: Pueblo = null, minaMadera: boolean = false, minaPiedra: boolean = false) {
        super(scene, 0, 0, 'fichas',frame);
        this.scene = scene;
        this.nombre = nombre;
        this.nivel = nivel;
        this.colocada = colocada;
        this.oculta = oculta;
        this.frameNumero = frame;
        if (this.oculta) {
            var indiceFrame = 40 + nivel;
            this.setTexture('fichas', indiceFrame);
        }
        this.minaMadera = minaMadera;
        this.minaPiedra = minaPiedra;
        this.pueblo = pueblo;

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        //this.body.immovable = true;
        var scale = this.scene.game.scale.width / this.width / 8 ;
        if (scale > (this.scene.game.scale.height / this.height / 8))
            scale = this.scene.game.scale.height / this.height / 8;

        this.setScale(scale);

        this.setCollideWorldBounds(true);
        this.setInteractive();
        this.on("pointerup", this.clicked, this);
    }

    setMarcador(color: Phaser.Display.Color) {
        if (! this.marcador) {
            this.marcador = this.scene.add.sprite(this.x, this.y, 'marcadores', 0);  
            this.marcador.setScale(this.scale / 2);  
            this.marcador.setDepth(2);      
        }
        this.marcador.tint = color.color;
    }

    clicked() {
        if (this.colocada && this.pueblo) {
            this.scene.game.scene.pause('Map');            
            this.scene.game.scene.start('Pueblo', this.pueblo);
        }
    }
}