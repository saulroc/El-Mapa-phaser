import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';
import { Edificio } from '../Model/edificio';
import { Pueblo } from '../Model/pueblo';

var ini_edificios = [{
    nombre: 'ayuntamiento',
    posicion: -1,
    nivel: 1,
    oro: 2,
    madera: 0,
    piedra: 0,
    frame: 0
},
{
    nombre: 'almacen',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 1,
    piedra: 0,
    frame: 1
},
{
    nombre: 'cuartel',
    posicion: -1,
    nivel: 1,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 2
},
{
    nombre: 'estatua',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 0,
    piedra: 0,
    frame: 3
}]

@Injectable({
  providedIn: 'root'
})
export class PuebloSceneService extends Phaser.Scene {
    
    background: Phaser.GameObjects.Image;
    pueblo: Pueblo;
    edificios: Phaser.GameObjects.Group;

    public constructor() {
        super({ key: 'Pueblo' });
    }

    public init(pueblo: Pueblo) {
        this.pueblo = pueblo;
    }

    public preload() {
        this.load.spritesheet('edificios', 'assets/edificios.png', { frameWidth: 413, frameHeight: 413 });
        this.load.image('fondo', 'assets/Tablero Castillo 3.png');

    }

    public create() {
        this.background = this.add.image(0, 0, 'fondo');
        this.background.setOrigin(0, 0);

        var scale = this.game.scale.width / 413 / 8 ;
        if (scale > (this.game.scale.height / 413 / 8))
            scale = this.game.scale.height / 413 / 8;

        //var escalaX = this.cameras.main.width / this.background.width;
        //var escalaY = this.cameras.main.height / this.background.height;
        this.background.setScale(scale);
        
        this.edificios = this.add.group();

        var estilo = { 
            font: 'bold 16pt Arial',
            fill: '#000000',
            align: 'center',
            wordWrap: true
           }
        var textoVolver = this.add.text(this.cameras.main.width / 8 * 7, this.cameras.main.height / 12, 'Cerrar', estilo);
        textoVolver.setInteractive();
        textoVolver.on('pointerup', this.cerrar, this);

        this.cargarEdificios(ini_edificios);
    }

    cargarEdificios(edificios){
        for (var i = 0; i < edificios.length; i ++) {
            var edificio = new Edificio(this,
                edificios[i].frame, 
                edificios[i].nombre, 
                edificios[i].posicion, 
                edificios[i].oro, 
                edificios[i].madera,
                edificios[i].piedra );
            
            edificio.posicionar();
            this.edificios.add(edificio);
        }
    }

    cerrar() {
        this.scene.resume('Map');
        this.scene.stop();
    }

    public update() {

    }
}