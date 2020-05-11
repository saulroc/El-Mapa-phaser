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
    tesoros: any;
    marcador: Phaser.GameObjects.Sprite;
    marcadoresTropas: Phaser.GameObjects.Group[];

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
        this.pelotones = [];
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

    colocar(posicionX: number, posicionY: number, jugador: Jugador) {
        
        this.setPosition(posicionX + this.width * this.scaleX / 2, posicionY + this.height * this.scaleY / 2);                

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

        var tropas: Tropa[] = [];
        tropas.push(tropa);
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

    cargarMarcadoresTropas() {
        this.marcadoresTropas.forEach(marcadorTropas => { 
            marcadorTropas.clear(true, true);
            marcadorTropas.destroy();
            this.marcadoresTropas.pop();
        });

        this.pelotones.forEach(peloton => { this.addMarcadorTropas(peloton); });
    }

    seleccionarMarcadorTropas(pointer, localX, localY, event) {
        //this.tint = 0xffffff;
        var escenaMapa = <MapSceneService>this.scene;
        if (escenaMapa.jugadorActivo.color.color == this.tint)
        {
            console.log("seleccionado", this);            
            this.setScale(this.scaleX * 2);
        }

        event.stopPropagation();
    }

    addMarcadorTropas(peloton: Peloton) {
        var grupoMarcadorTropas = this.scene.add.group();
        var desplazamientoX = this.width * this.scaleX / 4;
        var desplazamientoY = this.height * this.scaleY / 4;
        console.log("Ficha", this);
                
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