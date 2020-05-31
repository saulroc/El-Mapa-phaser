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
        this.on('pointerup', this.seleccionarEdificio);

    }   
    
    pintarTropas() {
        
        var escala = this.scaleX;
        var cantidad = 0;
        var frameTropa = 1;
        var escenaPueblo = <PuebloSceneService>this.scene;

        if (this.edificio.tropa) {
            cantidad = Math.floor(this.edificio.tropa.cantidad + 0.001);
            frameTropa += this.edificio.tropa.nivel;
        }

        for(var i = 0; i < cantidad; i++) {
            var x = this.x + (0.25 - Math.random() * 0.5) * this.width * this.scaleX;
            var y = this.y + (0.25 - Math.random() * 0.5) * this.height * this.scaleY;
            var tropaSprite = this.scene.add.sprite(x, y, 'marcadores', frameTropa);
            tropaSprite.setData('tropa', this.edificio.tropa);
            tropaSprite.setScale(escala / 2);
            tropaSprite.setDepth(2);
            tropaSprite.setInteractive();
            tropaSprite.on('pointerup', escenaPueblo.seleccionarTropaParaComprar);                        
        }
    }

    seleccionarEdificio() {
        var escenaPueblo = <PuebloSceneService><unknown>this.scene;
        if(escenaPueblo.posicionSeleccionada >= 0 && this.edificio.posicion == -1)
            escenaPueblo.construirEdificio(this);
        else
            escenaPueblo.mostrarInformacion(this);
    }

    
}