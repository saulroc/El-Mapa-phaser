import * as Phaser from 'phaser';

export class Edificio extends Phaser.GameObjects.Sprite {
    nombre: string;
    posicion: number;
    oro: number = 0;
    madera: number = 0;
    piedra: number = 0;
    numeroFrame: number = 0;
    /**
     *
     */
    constructor(scene: Phaser.Scene, frame: number, nombre: string, posicion: number, oro: number, madera: number, piedra: number) {
        super(scene, 0, 0, 'edificios',frame);
        this.scene = scene;
        this.nombre = nombre;
        this.posicion = posicion;
        this.oro = oro;
        this.madera = madera;
        this.piedra = piedra;
        this.numeroFrame = frame;
        
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        //this.body.immovable = true;
        var scale = this.scene.game.scale.width / this.width / 8 ;
        if (scale > (this.scene.game.scale.height / this.height / 8))
            scale = this.scene.game.scale.height / this.height / 8;

        this.setScale(scale);

        this.setInteractive();
        //this.on("pointerup", this.clicked, this);
    }    

    posicionar() {
        var x: number, y: number;

        switch (this.posicion) {
            case -1:
                x = this.scene.scale.width - this.width * this.scaleX;
                y = this.numeroFrame * this.height * this.scaleY + (this.height * this.scaleY) / 2;
                break;
            case 0-3:
                x = this.posicion * this.width * this.scaleX;
                y = this.height * this.scaleY * 3 + (this.height * this.scaleY) / 2;
                break;

            case 4-6:
                x = (this.posicion - 4) * this.width * this.scaleX + this.width / 2;
                y = this.height * this.scaleY * 2 + (this.height * this.scaleY) / 2;
                break;
            case 7-8:
                x = (this.posicion - 6) * this.width * this.scaleX;
                y = this.height * this.scaleY * 1 + (this.height * this.scaleY) / 2;
                break;
            case 9:
                x = (this.posicion - 8) * this.width * this.scaleX + this.width / 2;
                y = (this.height * this.scaleY) / 2;
                break;
            default:
                x = this.scene.scale.width - this.width * this.scaleX;
                y = this.numeroFrame * this.height * this.scaleY;
                break;
        }

        this.setPosition(x, y);
    }

    sePuedeConstruir(oro:number, madera: number, piedra: number) {
        return this.oro <= oro && this.madera <= madera && this.piedra <= piedra;
    }
}