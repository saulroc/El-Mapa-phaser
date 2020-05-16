import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';

@Injectable({
    providedIn: 'root'
  })
  export class GameOverSceneService extends Phaser.Scene {
    
    jugadores: Jugador[];
    
    public constructor() {
        super({ key: 'GameOver' });
        this.jugadores = [];
    }

    public init(jugadores: Jugador[]) {
        this.jugadores = jugadores;
    }

    public create() {
        var texto = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "GAME OVER!");
    }
  }