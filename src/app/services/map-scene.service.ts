import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';
import { Ficha } from '../Model/ficha';

@Injectable({
  providedIn: 'root'
})
export class MapSceneService extends Phaser.Scene {

    dude;
    keys;
    player;
    sceneWidthHalf: number;
    mapa: Phaser.Physics.Arcade.Group;
    zonaColocacion: Phaser.Physics.Arcade.Group;
    jugadores: Phaser.Physics.Arcade.Group; //Jugador[];
    jugadorActivo: Jugador;
    fichaColocando: Ficha;
    numeroJugadores: number = 2;
    colores = ["0xff0000", "0x0000ff"];
    colocandoFichas: boolean;
    controls;
    textoInformacion: Phaser.GameObjects.Text;
    marker;
    map;

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
      
      this.textoInformacion = this.add.text(this.game.scale.width / 2, this.game.scale.height / 8, "");
      this.textoInformacion.setScrollFactor(0);
      this.textoInformacion.text = "Cargando partida";
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
      this.mapa = this.physics.add.group();
      this.zonaColocacion = this.physics.add.group();
      this.zonaColocacion.create(this.cameras.main.centerX, this.cameras.main.centerY);
            
      // this.jugadorActivo;     
      this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

      }); 

      this.input.on('dragend', this.onDragStop, this);
      this.activarJugador(<Jugador>this.jugadores.getChildren()[0]);
      
      this.map = this.make.tilemap({ tileWidth: 413, tileHeight: 413, width: 80, height: 80});
      var tiles = this.map.addTilesetImage('fichas');
      var layer1 = this.map.createBlankDynamicLayer('layer1', tiles);
      layer1.randomize(0, 0, this.map.width, this.map.height, [ -1, 0, 1, 2, 3, 4, 5, 6, 7, 12 ]);
      //layer1.scale;
      this.marker = this.add.graphics();
      this.marker.lineStyle(2, 0x000000, 1);
      this.marker.strokeRect(0, 0, this.map.tileWidth * layer1.scaleX, this.map.tileHeight * layer1.scaleY);
  
    }

    public update(time, delta) {
      var worldPoint = <Phaser.Math.Vector2>this.input.activePointer.positionToCamera(this.cameras.main);

      // Rounds down to nearest tile
      var pointerTileX = this.map.worldToTileX(worldPoint.x);
      var pointerTileY = this.map.worldToTileY(worldPoint.y);

      // Snap to tile coordinates, but in world space
      this.marker.x = this.map.tileToWorldX(pointerTileX);
      this.marker.y = this.map.tileToWorldY(pointerTileY);
      if (this.colocandoFichas) {

        this.generarZonaDeColocacion();

      } else {

      }

      this.controls.update(delta);

    }

    activarJugador(jugador: Jugador) {
      this.jugadorActivo = jugador;
      jugador.activar();
      if (this.colocandoFichas) {
        this.textoInformacion.text = "Colocando ficha " + jugador.nombre;
        this.fichaColocando = jugador.getSiguienteFicha();
        this.fichaColocando.setVisible(true);
        this.input.setDraggable(this.fichaColocando);
        //this.input.setDragState
        //this.fichaColocando.input.dragState
      }

    }

    generarZonaDeColocacion() {

    }
  
    onDragStop(pointer, sprite) {
      
      if (!this.physics.overlap(sprite, this.zonaColocacion))
      {
        console.log("No Overlap");  
        //this.game.add.tween(sprite).to( { x: this.game.scale.width / 2, y: this.game.scale.height / 2 }, 500, "Back.easeOut", true);
          // this.tweens.add({

          // });
      } else {
        console.log("Overlap");  
        this.mapa.add(sprite);
        sprite.setDraggable(false);
      }
    
    }
    
}
