import * as Phaser from 'phaser';

export class Edificio extends Phaser.GameObjects.Sprite {
    nombre: string;
    posicion: number;
    oro: number = 0;
    madera: number = 0;
    piedra: number = 0;
    nivel: number = 1;
    numeroFrame: number = 0;
    /**
     *
     */
    constructor(scene: Phaser.Scene, frame: number, nombre: string, nivel:number, posicion: number, oro: number, madera: number, piedra: number) {
        super(scene, 0, 0, 'edificios',frame);
        this.scene = scene;
        this.nombre = nombre;
        this.posicion = posicion;
        this.oro = oro;
        this.madera = madera;
        this.piedra = piedra;
        this.numeroFrame = frame;
        this.nivel = nivel;
        
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

    sePuedeConstruir(oro:number, madera: number, piedra: number, posicion: number) {
        return this.oro <= oro 
            && this.madera <= madera 
            && this.piedra <= piedra
            && (this.nivel == 1 
                || (this.nivel == 2 && posicion > 3) 
                || (this.nivel == 3 && posicion > 6)
                || (this.nivel == 4 && posicion > 8));
    }
}