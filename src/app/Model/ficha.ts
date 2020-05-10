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
    minaOro: any;
    tesoros: any;
    marcador: Phaser.GameObjects.Sprite;
    marcadoresTropas: Phaser.GameObjects.Sprite[];

    public constructor(scene: Phaser.Scene, frame: number, nombre: string, nivel: number, colocada: boolean, oculta: boolean, pueblo: Pueblo = null, minaMadera: boolean = false, minaPiedra: boolean = false, minaOro: boolean = false) {
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
        this.minaOro = minaOro;
        this.pueblo = pueblo;
        this.marcadoresTropas = [];
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        //this.body.immovable = true;
        var scale = this.getEscala();

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

    deleteMarcador() {
        if (this.marcador) {
            this.marcador.destroy();    
        }
    }

    addTropas() {
        
    }

    addMarcadorTropas(color: Phaser.Display.Color) {
        var marcadorTropas = this.scene.add.sprite(this.x, this.y, 'marcadores', 1);
        marcadorTropas.setScale(this.scale / 4);  
        marcadorTropas.setDepth(2); 
        marcadorTropas.tint = color.color;
        var desplazamientoX = this.width * this.scaleX / 4;
        var desplazamientoY = this.height * this.scaleY / 4;
        switch (this.marcadoresTropas.length) {
            case 0:
                marcadorTropas.setPosition(this.x - desplazamientoX, this.y - desplazamientoY);
                break;

            case 1:
                marcadorTropas.setPosition(this.x - desplazamientoX, this.y + desplazamientoY);
                break;
            case 2:
                break;
            default:
                break;
        }
        this.marcadoresTropas.push(marcadorTropas);
    }

    getEscala() {
        var scale = this.scene.game.scale.width / this.width / 8 ;
        if (scale > (this.scene.game.scale.height / this.height / 8))
            scale = this.scene.game.scale.height / this.height / 8;
        return scale;
    }

    clicked() {
        if (this.colocada && this.pueblo) {
            this.scene.game.scene.pause('Map');            
            this.scene.game.scene.start('Pueblo', this);
        }
    }
}