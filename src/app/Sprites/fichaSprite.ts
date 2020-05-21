import * as Phaser from 'phaser';
import { Pueblo } from '../Model/pueblo';
import { PuebloSceneService } from '../services/pueblo-scene.service';
import { Peloton } from '../Model/peloton';
import { JugadorSprite } from './jugadorSprite';
import { Tropa } from '../Model/tropa';
import { MapSceneService } from '../services/map-scene.service';
import { PelotonSprite } from './pelotonSprite';
import { Ficha } from '../Model/ficha';

export class FichaSprite extends Phaser.Physics.Arcade.Sprite {
    ficha: Ficha;
    
    marcador: Phaser.GameObjects.Sprite;
    marcadoresTropas: Phaser.GameObjects.Group[];
    marcadoresTesoros: Phaser.GameObjects.Group;
    activarTween: Phaser.Tweens.Tween;

    public constructor(scene: Phaser.Scene, ficha: Ficha) {
        super(scene, 0, 0, 'fichas',ficha.frameNumero);
        this.scene = scene;
        this.ficha = ficha;

        if (this.ficha.oculta) {
            var indiceFrame = 40 + this.ficha.nivel;
            this.setTexture('fichas', indiceFrame);
        }
        
        this.marcadoresTropas = [];
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        //this.body.immovable = true;
        var scale = this.getEscala();

        this.setScale(scale);

        this.setCollideWorldBounds(true);
        this.setInteractive();
        this.on("pointerup", this.clicked, this);

        this.marcadoresTesoros = this.scene.add.group();
        this.activarTween = this.scene.tweens.add({
            targets: [],
            alpha: { start: 1, to:0, duration: 1000, ease: 'Power1' },
            paused: true,
            yoyo: true,
            loop: -1
        });
    }

    setMarcador(color: Phaser.Display.Color) {
        if (! this.marcador) {
            this.marcador = this.scene.add.sprite(this.x, this.y, 'marcadores', 0);  
            this.marcador.setScale(this.scale / 2);  
            this.marcador.setDepth(2);  
            if(this.ficha.pueblo) {
                this.marcador.setAlpha(0.5);  
                this.activarTween.targets.push(this.marcador);
            } 
        }
        this.marcador.tint = color.color;
        
    }

    colocar(posicionX: number, posicionY: number, jugador: JugadorSprite) {
        
        this.setPosition(posicionX + this.width * this.scaleX / 2, posicionY + this.height * this.scaleY / 2);                
        this.setScrollFactor(1);
        if (this.ficha.oculta)
            this.tint = jugador.color.color;

        this.ficha.colocada = true;
        if (!this.ficha.oculta) {
            if (this.ficha.pueblo) {
                var color = Phaser.Display.Color.HexStringToColor(this.ficha.pueblo.color);
                this.setMarcador(color);
            }
            
            if (this.ficha.pelotones.length > 0)
                this.cargarMarcadoresTropas();

            if (this.ficha.tesoros > 0)
                this.cargarMarcadoresTesoros();
        }
        
    }

    voltear() {
        if (this.ficha.oculta) {
            this.clearTint();
            this.setFrame(this.ficha.frameNumero);
            var color = Phaser.Display.Color.HexStringToColor(this.ficha.pueblo.color);

            if (this.ficha.pueblo) {
                var color = Phaser.Display.Color.HexStringToColor(this.ficha.pueblo.color);
                this.setMarcador(color);
            }
            
            if (this.ficha.pelotones.length > 0)
                this.cargarMarcadoresTropas();    

            if (this.ficha.tesoros > 0)
                this.cargarMarcadoresTesoros();
                            
        }
        this.ficha.oculta = false;
    }

    deleteMarcador() {
        if (this.marcador) {
            this.marcador.destroy();    
        }
    }

    cargarMarcadoresTropas() {
        while (this.marcadoresTropas.length > 0) {
            var marcadorTropas = this.marcadoresTropas.pop();
            marcadorTropas.clear(true, true);
            marcadorTropas.destroy();
        }        

        this.ficha.pelotones.forEach(peloton => { 
            this.addMarcadorTropas(peloton); 
            if (this.ficha.pelotones.length > 1) {
                peloton.paralizar();
            }
        });
    }    

    addMarcadorTropas(peloton: Peloton) {
        var grupoMarcadorTropas = this.scene.add.group();
        var desplazamientoX = this.width * this.scaleX / 4;
        var desplazamientoY = this.height * this.scaleY / 4;
                
        switch (this.marcadoresTropas.length) {
            case 0:
                var marcadorTropas = new PelotonSprite(this.scene, this.x - desplazamientoX, this.y  - desplazamientoY, peloton, this);
                grupoMarcadorTropas.add(marcadorTropas);                
                break;

            case 1:
                var marcadorTropas = new PelotonSprite(this.scene, this.x - desplazamientoX, this.y  + desplazamientoY, peloton, this);
                grupoMarcadorTropas.add(marcadorTropas);                
                break;
            case 2:
                break;
            default:
                break;
        }

        this.marcadoresTropas.push(grupoMarcadorTropas);
    } 
    
    cargarMarcadoresTesoros() {
        this.marcadoresTesoros.clear(true,true);
        for (var i = 0; i < this.ficha.tesoros; i++) {
            this.addMarcadorTesoro();
        } 
    }

    addMarcadorTesoro() {
        var desplazamientoX = this.width * this.scaleX / 4;
        var desplazamientoY = this.height * this.scaleY / 4;
        
        switch (this.marcadoresTesoros.getChildren().length) {
            case 0:
                var marcadorTesoro = this.scene.add.sprite(this.x + desplazamientoX, this.y  - desplazamientoY, 'marcadores', 6);
                marcadorTesoro.setScale(this.scaleX / 2);
                marcadorTesoro.setDepth(2);
                this.marcadoresTesoros.add(marcadorTesoro);               
                break;

            case 1:
                var marcadorTesoro = this.scene.add.sprite(this.x + desplazamientoX, this.y  + desplazamientoY, 'marcadores', 6);
                marcadorTesoro.setScale(this.scaleX / 2);                
                marcadorTesoro.setDepth(2);
                this.marcadoresTesoros.add(marcadorTesoro);               
                break;
            case 2:
                break;
            default:
                break;
        }
    }    

    tieneMina() {
        return this.ficha.tieneMina();
    }

    reclamar() {
        if (this.ficha.sePuedeReclamar()) {
            var color = Phaser.Display.Color.HexStringToColor(this.ficha.pelotones[0].jugador.color);
            if (!this.marcador)
                this.setMarcador(color);
            else 
                this.marcador.setTint(color.color);
            
            return true;
        }

        return false;
    }

    reclamarTesoros(jugador: JugadorSprite) {
        if (this.ficha.sePuedeReclamarTesoros(jugador.jugador)) {
            this.ficha.reclamarTesoros(jugador.jugador);
            this.cargarMarcadoresTesoros();
        }
    }

    getEscala() {
        var scale = this.scene.game.scale.width / this.width / 8 ;
        if (scale > (this.scene.game.scale.height / this.height / 8))
            scale = this.scene.game.scale.height / this.height / 8;
        return scale;
    }

    clicked() {
        if (this.ficha.colocada && this.ficha.pueblo && !this.ficha.oculta) {
            this.scene.game.scene.pause('Map');            
            this.scene.game.scene.start('Pueblo', this);
        }
    }

    update() {
        if(this.ficha.colocada && this.visible && this.ficha.pueblo && !this.ficha.pueblo.construido && this.marcador) {
            this.activarTween.restart();
            this.activarTween.resume();
        } else if (this.activarTween.isPlaying()) {
            this.activarTween.pause();
            if(this.marcador)
                this.marcador.setAlpha();
        }
    }
}