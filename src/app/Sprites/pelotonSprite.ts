import * as Phaser from 'phaser';

import { Peloton } from '../Model/peloton';
import { MapSceneService } from '../services/map-scene.service';
import { FichaSprite } from './fichaSprite';

export class PelotonSprite extends Phaser.Physics.Arcade.Sprite {
    peloton: Peloton;
    ficha: FichaSprite;
    grupoTropas: Phaser.GameObjects.Group;
    seleccionado: boolean = false;

    public constructor (scene: Phaser.Scene, x: number, y:number, peloton: Peloton, ficha: FichaSprite){
        super(scene, x, y, 'marcadores',1);
        this.peloton = peloton;

        if (peloton.jugador && peloton.jugador.color) {
            var color = Phaser.Display.Color.HexStringToColor(peloton.jugador.color);
            this.tint = color.color;
        }        
        
        this.ficha = ficha;
        
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        
        this.setScale(this.ficha.getEscala() / 2);  
        this.setDepth(2); 
        this.setInteractive();
        this.on('pointerup', this.seleccionarMarcadorTropas);
        this.grupoTropas = this.scene.add.group();
        this.dibujarTropas(this.grupoTropas, this.x, this.y, 1, 1);
    }

    seleccionarMarcadorTropas() {
        var escenaMapa = <MapSceneService>this.scene;
        var jugadorActivo = escenaMapa.jugadorActivo;
        var escala = 0;

        if (this.peloton.jugador == jugadorActivo.jugador && this.peloton.puedeMover()
            && (!this.peloton.estaIniciandoMovimiento() || this.peloton.jugador.puedeMoverNuevoPeloton())) {            
            if (this.seleccionado) {
                this.setScale(this.scaleX / 2);
                escala = this.scaleX * -1;                                
                escenaMapa.pelotonSeleccionado = null;
            } else {
                escala = this.scaleX;                
                this.setScale(this.scaleX * 2);
                escenaMapa.pelotonSeleccionado = this;
            }
            this.grupoTropas.scaleXY(escala);    
            this.seleccionado = !this.seleccionado;
        }        
    }

    dibujarTropas(grupo: Phaser.GameObjects.Group,posicionX: number, posicionY: number, direccionX: number, direccionY: number) {
        var x = posicionX;
        var y = posicionY;
        var numeroFrame: number = 0;
        grupo.clear(true,true);

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
                tropaSprite.setScale(this.scale * 0.75);  
                tropaSprite.setDepth(2); 
                grupo.add(tropaSprite);
            }
        }
    }

    setVisible(value: boolean) {
        if (this.grupoTropas && this.grupoTropas.children)
            this.grupoTropas.setVisible(value);
        return super.setVisible(value);
    }

    destroy(fromScene: boolean = false) {
        this.grupoTropas.destroy(true);
        super.destroy(fromScene);
    }

}