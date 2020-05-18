import * as Phaser from 'phaser';
import { Pueblo } from './pueblo';
import { PuebloSceneService } from '../services/pueblo-scene.service';
import { Peloton } from './peloton';
import { Jugador } from './jugador';
import { Tropa } from './tropa';
import { MapSceneService } from '../services/map-scene.service';
import { PelotonSprite } from './pelotonSprite';

export class Ficha extends Phaser.Physics.Arcade.Sprite {
    nombre: string;
    nivel: number;
    colocada: boolean;
    oculta: boolean;
    frameNumero: number;
    pueblo: Pueblo;
    pelotones: Peloton[];
    minaMadera: boolean;
    minaPiedra: boolean;
    minaOro: boolean;
    minaTecnologia: number;
    tesoros: number;
    marcador: Phaser.GameObjects.Sprite;
    marcadoresTropas: Phaser.GameObjects.Group[];
    marcadoresTesoros: Phaser.GameObjects.Group;

    public constructor(scene: Phaser.Scene, frame: number, nombre: string, nivel: number, colocada: boolean, oculta: boolean, pueblo: Pueblo = null, minaMadera: boolean = false, minaPiedra: boolean = false, minaOro: boolean = false, minaTecnologia: number = 0, tesoros: number = 0) {
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
        this.minaTecnologia = minaTecnologia;
        this.tesoros = tesoros;
        this.pueblo = pueblo;
        this.marcadoresTropas = [];
        this.pelotones = [];
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        //this.body.immovable = true;
        var scale = this.getEscala();

        this.setScale(scale);

        this.setCollideWorldBounds(true);
        this.setInteractive();
        this.on("pointerup", this.clicked, this);

        this.marcadoresTesoros = this.scene.add.group();
    }

    setMarcador(color: Phaser.Display.Color) {
        if (! this.marcador) {
            this.marcador = this.scene.add.sprite(this.x, this.y, 'marcadores', 0);  
            this.marcador.setScale(this.scale / 2);  
            this.marcador.setDepth(2);  
            if(this.pueblo)  
                this.marcador.setAlpha(0.5);  
        }
        this.marcador.tint = color.color;
        
    }

    colocar(posicionX: number, posicionY: number, jugador: Jugador) {
        
        this.setPosition(posicionX + this.width * this.scaleX / 2, posicionY + this.height * this.scaleY / 2);                
        this.setScrollFactor(1);
        if (this.oculta)
            this.tint = jugador.color.color;

        this.colocada = true;
        if (!this.oculta) {
            if (this.pueblo)
                this.setMarcador(this.pueblo.color);
            
            if (this.pelotones.length > 0)
                this.cargarMarcadoresTropas();
        }
        
    }

    voltear() {
        if (this.oculta) {
            this.clearTint();
            this.setFrame(this.frameNumero);

            if (this.pueblo)
                this.setMarcador(this.pueblo.color);
            
            if (this.pelotones.length > 0)
                this.cargarMarcadoresTropas();    

            if (this.tesoros > 0)
                this.cargarMarcadoresTesoros();
                            
        }
        this.oculta = false;
    }

    deleteMarcador() {
        if (this.marcador) {
            this.marcador.destroy();    
        }
    }

    addTropa(jugador: Jugador, tropa: Tropa) {
        for(var i = 0; i < this.pelotones.length; i ++) {
            if (this.pelotones[i].jugador == jugador) {
                this.pelotones[i].agregarTropa(tropa);
                return;
            }
        }
        var nuevaTropa = new Tropa(
            tropa.tipo, 
            tropa.cantidad,
            tropa.ataque,
            tropa.vida,
            tropa.movimiento,
            tropa.movido,
            tropa.velocidad,
            tropa.distanciaDeAtaque);
        var tropas: Tropa[] = [];
        tropas.push(nuevaTropa);
        this.addPeloton(jugador, tropas);

    }

    addPeloton(jugador: Jugador, tropas: Tropa[]) {
        var peloton = new Peloton(jugador, tropas);
        this.pelotones.push(peloton);
    }

    addTropas(jugador: Jugador, tropas: Tropa[]) {
        for (var i = 0; i < tropas.length; i ++) {
            this.addTropa(jugador, tropas[i]);
        }
    }

    deleteTropas(jugador: Jugador, tropas: Tropa[]) {        
        for (var i = 0; i < this.pelotones.length; i++) {
            var peloton = this.pelotones[i]
            if (jugador == peloton.jugador) {
                for(var j = 0; j < tropas.length; j++) {
                    peloton.quitarTropa(tropas[j]);
                }

                if (peloton.tropas.length == 0) {
                    this.pelotones.splice(i, 1);
                }
            }
        }
    }

    cargarMarcadoresTropas() {
        while (this.marcadoresTropas.length > 0) {
            var marcadorTropas = this.marcadoresTropas.pop();
            marcadorTropas.clear(true, true);
            marcadorTropas.destroy();
        }        

        this.pelotones.forEach(peloton => { 
            this.addMarcadorTropas(peloton); 
            if (this.pelotones.length > 1) {
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
        this.marcadoresTesoros.clear();
        for (var i = 0; i < this.tesoros; i++) {
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

    getPelotonesCombate() {
        if (this.pelotones.length > 1) 
            return this.pelotones;

        return null;
    }

    tieneMina() {
        return (this.minaMadera || this.minaPiedra || this.minaOro || this.minaTecnologia > 0);
    }

    reclamar() {
        if (this.pelotones.length == 1 
            && this.pelotones[0].jugador
            && (this.tieneMina() || this.pueblo)) {
            
            if (!this.marcador)
                this.setMarcador(this.pelotones[0].jugador.color);
            else 
                this.marcador.setTint(this.pelotones[0].jugador.color.color);
            
            return true;
        }

        return false;
    }

    reclamarTesoros(jugador: Jugador) {
        if (this.pelotones.length == 1 
            && this.pelotones[0].jugador
            && this.pelotones[0].jugador == jugador
            && this.tesoros > 0) {
            
            for (var i = 0; i< this.tesoros; i++) {
                var tipoRecursos = Phaser.Math.Between(1, 6);
                switch (tipoRecursos) {
                    case 1: //oro
                    case 2:
                    case 3:
                        var cantidad = Phaser.Math.Between(1, 6);
                        jugador.setOro(cantidad);
                        break;
                    case 4:
                    case 5:
                        var cantidad = Phaser.Math.Between(1, 3);
                        jugador.setMadera(cantidad);
                        break;
                    case 6:
                        var cantidad = Phaser.Math.Between(1, 2);
                        jugador.setPiedra(cantidad);
                        break;
                    default:
                        break;
                }
            }
            this.tesoros = 0;
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
        if (this.colocada && this.pueblo) {
            this.scene.game.scene.pause('Map');            
            this.scene.game.scene.start('Pueblo', this);
        }
    }

    update() {
        if(this.colocada && this.visible && this.pueblo && !this.pueblo.construido && this.marcador) {

        }
    }
}