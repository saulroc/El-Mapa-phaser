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
    numeroJugadores: number = 2;
    
    public constructor() {
      super({ key: 'Map' });
    }

    public preload() {
      this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
      this.load.spritesheet('jugador', 'assets/Jugador.png', { frameWidth: 413, frameHeight: 413 });

      this.sceneWidthHalf = window.innerWidth / 2;
    }

    public create(): void {
      this.dude = this.physics.add.sprite(this.sceneWidthHalf, 0, 'dude');

      this.dude.setBounce(0.2);
      this.dude.setCollideWorldBounds(true);

      this.jugadores = this.physics.add.group();
      for (var i = 0; i < this.numeroJugadores; i++) {
        var jugador = new Jugador(this);        
        this.jugadores.add(jugador,true);        
        jugador.setCollideWorldBounds(true);
        jugador.setX(jugador.getBounds().width * (i + 0.5));
      }

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

    public update() {
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

    }

    private isLeftTouch() {
      return this.input.activePointer.isDown && this.input.activePointer.downX < this.sceneWidthHalf;
    }

    private isRightTouch() {
      return this.input.activePointer.isDown && this.input.activePointer.downX >= this.sceneWidthHalf;
    }
}
