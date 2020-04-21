import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';

@Injectable({
  providedIn: 'root'
})
export class MapSceneService extends Phaser.Scene {

    dude;
    keys;
    player;
    sceneWidthHalf: number;
    mapa: Phaser.Physics.Arcade.Group;
    jugadores: Phaser.Physics.Arcade.Group; //Jugador[];
    jugadorActivo: Jugador;
    numeroJugadores: number = 2;
    colores = ["0xff0000", "0x0000ff"];
    colocandoFichas: boolean;
    controls;

    public constructor() {
      super({ key: 'Map' });
    }

    public preload() {
      this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
      this.load.spritesheet('fichas', 'assets/Fichas.png', { frameWidth: 414, frameHeight: 414 });
      this.load.spritesheet('jugador', 'assets/Jugador.png', { frameWidth: 413, frameHeight: 413 });

      this.sceneWidthHalf = window.innerWidth / 2;
    }

    public create(): void {
      this.dude = this.physics.add.sprite(this.sceneWidthHalf, 0, 'dude');

      this.dude.setBounce(0.2);
      this.dude.setCollideWorldBounds(true);

      this.physics.world.setBounds(0, 0, this.game.scale.width * 4, this.game.scale.height * 4);
      
      var cursors = this.input.keyboard.createCursorKeys();

      var controlConfig = {
          camera: this.cameras.main,
          left: cursors.left,
          right: cursors.right,
          up: cursors.up,
          down: cursors.down,
          zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
          zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
          acceleration: 0.06,
          drag: 0.0005,
          maxSpeed: 1.0
      };
  
      this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);
  
      this.colocandoFichas = true;
      this.jugadores = this.physics.add.group();
      for (var i = 0; i < this.numeroJugadores; i++) {
        var color = Phaser.Display.Color.HexStringToColor(this.colores[i]);        
        var jugador = new Jugador(this, color, "Jugador " + (i+1), i);        
        this.jugadores.add(jugador,true);        
        jugador.setCollideWorldBounds(true);
        jugador.setScrollFactor(0);
        jugador.inicializarFichas();
      }

      this.colocandoFichas = true;
      // this.jugadorActivo = this.jugadores.getFirst();
      // this.jugadorActivo;

      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
      });

      this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
      });

      this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
      });

      this.keys = this.input.keyboard.createCursorKeys();

    }

    public update(time, delta) {

      if (this.keys.left.isDown || this.isLeftTouch()) {
        this.dude.setVelocityX(-160);
        this.dude.anims.play('left', true);
      } else if (this.keys.right.isDown  || this.isRightTouch()) {
        this.dude.setVelocityX(160);
        this.dude.anims.play('right', true);
      } else {
        this.dude.setVelocityX(0);
        this.dude.anims.play('turn');
      }

      this.controls.update(delta);

    }

    private isLeftTouch() {
      return this.input.activePointer.isDown && this.input.activePointer.downX < this.sceneWidthHalf;
    }

    private isRightTouch() {
      return this.input.activePointer.isDown && this.input.activePointer.downX >= this.sceneWidthHalf;
    }
}
