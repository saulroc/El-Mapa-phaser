import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';
import { Edificio } from '../Model/edificio';

@Injectable({
  providedIn: 'root'
})
export class PuebloSceneService extends Phaser.Scene {
    
    public constructor() {
        super({ key: 'Pueblo' });
    }

    public preload() {
        this.load.spritesheet('edificios', 'assets/edificios.png', { frameWidth: 32, frameHeight: 48 });
        this.load.image('fondo', 'assets/Tablero Castillo 3.png');

    }

    public create() {

    }

    public update() {

    }
}