import * as Phaser from 'phaser';
import { Edificio } from '../Model/edificio';
import { PuebloSceneService } from '../services/pueblo-scene.service';

export class EdificioSprite extends Phaser.GameObjects.Sprite {
    edificio: Edificio;
    
    /**
     *
     */
    constructor(scene: Phaser.Scene, edificio: Edificio) {
        super(scene, 0, 0, 'edificios',edificio.numeroFrame);
        this.scene = scene;
        this.edificio = edificio;
        
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        var scale = this.scene.game.scale.width / this.width / 8 ;
        if (scale > (this.scene.game.scale.height / this.height / 8))
            scale = this.scene.game.scale.height / this.height / 8;

        this.setScale(scale);

        this.setInteractive();
    }   
    
    pintarTropas() {
        var x = this.x - 0.5 * this.width * this.scaleX;
        var y = this.y - 0.5 * this.height * this.scaleY;
        var escala = this.scaleX;
        var cantidad = 0;
        var frameTropa = 1;
        var escenaPueblo = <PuebloSceneService>this.scene;

        if (this.edificio.tropa) {
            cantidad = Math.floor(this.edificio.tropa.cantidad + 0.001);
            frameTropa += this.edificio.tropa.nivel;
        }

        for(var i = 0; i < cantidad; i++) {
            var tropaSprite = this.scene.add.sprite(x, y, 'marcadores', frameTropa);
            tropaSprite.setData('tropa', this.edificio.tropa);
            tropaSprite.setScale(escala / 2);
            tropaSprite.setDepth(2);
            tropaSprite.setInteractive();
            tropaSprite.on('pointerup', escenaPueblo.seleccionarTropaParaComprar);            
            x += 5;
            y += 5;
        }
    }

    
}