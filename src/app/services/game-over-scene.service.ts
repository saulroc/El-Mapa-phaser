import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';

const COLOR_LETRA_BLANCO = '#FFFFFF';

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
        
        var bgImage = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.5);;
        bgImage.setOrigin(0, 0);

        var estilo = {
            font: 'bold 16pt Arial',
            fill: COLOR_LETRA_BLANCO,
            align: 'center',
            wordWrap: true
        };
        var texto = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "GAME OVER!", estilo);
        texto.setOrigin(0.5);

        this.jugadores.forEach(jugador => {
            
            texto = this.add.text(this.cameras.main.centerX, texto.y + texto.height, jugador.nombre + ": " + jugador.puntos, estilo);
            texto.setOrigin(0.5);

        });
    }
  }