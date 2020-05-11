import * as Phaser from 'phaser';

import { Peloton } from './peloton';
import { Ficha } from './ficha';
import { Tropa } from './tropa';

export class PelotonSprite extends Phaser.Physics.Arcade.Sprite {
    peloton: Peloton;
    ficha: Ficha;
    grupoTropas: Phaser.GameObjects.Group;

    public constructor (scene: Phaser.Scene, x: number, y:number, peloton: Peloton, ficha: Ficha){
        super(scene, x, y, 'marcadores',1);
        this.peloton = peloton;
        if (peloton.jugador && peloton.jugador.color)
            this.tint = peloton.jugador.color.color;
        this.ficha = ficha;
        
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        
        this.setScale(this.ficha.getEscala() / 4);  
        this.setDepth(2); 
        this.setInteractive();
        this.on('pointerup', this.seleccionarMarcadorTropas);
        this.grupoTropas = this.scene.add.group();
        this.dibujarTropas(this.grupoTropas, this.x, this.y, 1, 1);
    }

    seleccionarMarcadorTropas() {

    }

    dibujarTropas(grupo: Phaser.GameObjects.Group,posicionX: number, posicionY: number, direccionX: number, direccionY: number) {
        var x = posicionX;
        var y = posicionY;
        var numeroFrame: number = 0;
        for (var i = 0; i < this.peloton.tropas.length; i++) {
            var tropa =  this.peloton.tropas[i];
            switch (tropa.tipo) {
                case "leva" :
                    numeroFrame = 2;
                    break;
                case "soldado" :
                    numeroFrame = 3;
                    break;
                case "arquero": 
                    numeroFrame = 4;
                    break;
                case "caballero":
                    numeroFrame = 5;
                    break;
                default:
                    numeroFrame = 2;
                    break;
            }

            for(var j = 0; j < tropa.cantidad; j++) {
                x += 1 * direccionX;
                y += 1 * direccionY;
                var tropaSprite = this.scene.add.sprite(x, y, 'marcadores', numeroFrame);
                tropaSprite.setScale(this.scale);  
                tropaSprite.setDepth(2); 
                grupo.add(tropaSprite);
            }
        }
    }

}