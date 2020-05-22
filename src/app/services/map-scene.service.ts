import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { JugadorSprite } from '../Sprites/jugadorSprite';
import { FichaSprite } from '../Sprites/fichaSprite';
import { PelotonSprite } from '../Sprites/pelotonSprite';
import { Peloton } from '../Model/peloton';

//import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js';
import { ini_jugadores } from '../Model/datosIniciales';
import { Jugador } from '../Model/jugador';
import { Partida } from '../Model/partida';

const FRAME_FICHA_FONDO = 44;
const COLOR_LETRA_BLANCO = '#FFFFFF';
const COLOR_STROKE_LETRA = '#000000';
const COLOR_FICHA_ACTIVA = 0xf4d03f;
const COLOR_FICHA_NO_ACTIVA = 0xffffff;
const colores = ["0xff0000", "0x0000ff", "0x008000", "0xffff00", "0xD2B48C", "0xff4500", "0x800080", "0x00ffff"]; 

@Injectable({
  providedIn: 'root'
})
export class MapSceneService extends Phaser.Scene {
    
    sceneWidthHalf: number;
    partida: Partida;
    //zonaColocacion: Phaser.Physics.Arcade.Group;
    
    fichaColocando: FichaSprite;
    controls;
    textoInformacion: Phaser.GameObjects.Text;
    mensajesInformacion: {color: string, mensaje: string}[];    
    textoTerminarTurno: Phaser.GameObjects.Text;
    marker: Phaser.GameObjects.Graphics;
    map: Phaser.Tilemaps.Tilemap;
    layer1: Phaser.Tilemaps.DynamicTilemapLayer;
    tileSet: Phaser.Tilemaps.Tileset;
    tileSeleccionado: Phaser.Tilemaps.Tile; 
    jugadores: Phaser.GameObjects.Group;  
    jugadorActivo: JugadorSprite; 
    pelotonSeleccionado: PelotonSprite;
    mapaFichas: Phaser.GameObjects.Group;

    distancia: number;
    distanciaAnterior: number;
    distanciaDelta: number;
    escalarMundo: number = 1;

    public constructor() {
      super({ key: 'Map' });
      this.partida = new Partida();
      this.partida.iniciarJugadores();
      this.mensajesInformacion = [];
    }

    public preload() {
      this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
      this.load.spritesheet('fichas', 'assets/Fichas.png', { frameWidth: 413, frameHeight: 413 });
      this.load.spritesheet('jugador', 'assets/Jugador.png', { frameWidth: 413, frameHeight: 413 });
      this.load.spritesheet('marcadores', 'assets/Marcadores.png', { frameWidth: 413, frameHeight: 413 });

      this.sceneWidthHalf = window.innerWidth / 2;
    }

    public create(): void {      

      this.physics.world.setBounds(0, 0, this.game.scale.width * 4, this.game.scale.height * 4);
      
      this.map = this.make.tilemap({ tileWidth: 413, tileHeight: 413, width: 20 * this.partida.numeroJugadores, height: 20 * this.partida.numeroJugadores});
      this.tileSet = this.map.addTilesetImage('fichas');
      this.layer1 = this.map.createBlankDynamicLayer('layer1', this.tileSet);
      this.layer1.setPosition(0, 0);
      this.layer1.setOrigin(0.5);
      this.layer1.randomize(0, 0, this.map.width, this.map.height, [ FRAME_FICHA_FONDO]);

      var scale = this.game.scale.width / this.map.tileWidth / 8 ;
        if (scale > (this.game.scale.height / this.map.tileHeight / 8))
            scale = this.game.scale.height / this.map.tileHeight / 8;

      this.layer1.setScale(scale);
      this.physics.world.setBounds(0, 0, this.layer1.width * scale, this.layer1.height * scale);
      
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
      var estilo = { 
        font: 'bold 16pt Arial',
        fill: COLOR_LETRA_BLANCO,
        align: 'center',
        wordWrap: true
       }
      this.textoInformacion = this.add.text(this.game.scale.width / 2, this.game.scale.height / 6, "", estilo);
      this.textoInformacion.setOrigin(0.5);
      this.textoInformacion.setScrollFactor(0);
      this.textoInformacion.setDepth(3);
      this.textoInformacion.setStroke(COLOR_STROKE_LETRA, 2);
      this.textoInformacion.setShadow(2, 2, COLOR_STROKE_LETRA, 2, true, true);
      this.textoInformacion.text = "Cargando partida";
      
      this.iniciarJugadores();

      this.partida.colocandoFichas = true;
      //this.zonaColocacion = this.physics.add.group();
      //this.zonaColocacion.create(this.cameras.main.centerX, this.cameras.main.centerY);
        
      this.marker = this.add.graphics();
      this.marker.lineStyle(4, 0xFFFFFF, 1);
      this.marker.strokeRect(0, 0, this.map.tileWidth * this.layer1.scaleX, this.map.tileHeight * this.layer1.scaleY);

      this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

      }); 

      this.input.on('dragend', this.onDragStop, this);
      this.input.on('pointerup', this.clickear, this);

      this.mapaFichas = this.add.group();

      this.cameras.main.setScroll(this.physics.world.bounds.centerX - this.cameras.main.width / 2, this.physics.world.bounds.centerY  - this.cameras.main.height / 2)
      if (this.game.input.pointers.length < 2)
        this.input.addPointer(1);
      this.activarJugador(0);
      //var pinch = this.rexGestures.add.pinch();

      // var camera = this.cameras.main;
      // pinch
      //     .on('drag1', function (pinch) {
      //         var drag1Vector = pinch.drag1Vector;
      //         camera.scrollX -= drag1Vector.x / camera.zoom;
      //         camera.scrollY -= drag1Vector.y / camera.zoom;
      //     })
      //     .on('pinch', function (pinch) {
      //         var scaleFactor = pinch.scaleFactor;
      //         camera.zoom *= scaleFactor;
      //     }, this)

    }

    public update(time, delta) {
      var worldPoint = <Phaser.Math.Vector2>this.input.activePointer.positionToCamera(this.cameras.main);
      //console.log("World point",worldPoint);

      // Rounds down to nearest tile
      var pointerTileX = this.map.worldToTileX(worldPoint.x);
      var pointerTileY = this.map.worldToTileY(worldPoint.y);

      // Snap to tile coordinates, but in world space
      this.marker.x = this.map.tileToWorldX(pointerTileX);
      this.marker.y = this.map.tileToWorldY(pointerTileY);          

      this.controls.update(delta);
      this.actualizarTextoInformacion();
      var punteros = this.game.input.pointers;
      if(punteros.length >= 2 && this.input.pointer1.isDown && this.input.pointer2.isDown) {        

        this.distanciaAnterior = this.distancia;    
        this.distancia = Phaser.Math.Distance.Between(this.input.pointer1.x, this.input.pointer1.y, this.input.pointer2.x,this.input.pointer2.y);
        this.distanciaDelta = Math.abs(this.distanciaAnterior - this.distancia);        
        if (this.distanciaAnterior > this.distancia && this.distanciaDelta > 4) { 
          this.escalarMundo -= 0.02; 
        } else if (this.distanciaAnterior < this.distancia && this.distanciaDelta > 4){ 
          this.escalarMundo += 0.02;
        }  
          
        this.escalarMundo = Phaser.Math.Clamp(this.escalarMundo, 0.5, 2); // set a minimum and maximum scale value    
        
        if (this.escalarMundo<2){        
          this.cameras.main.setZoom(this.escalarMundo);
          
        }          
      } else if (punteros.length >= 1 && this.input.pointer1.isDown) {
        if (this.input.pointer1.prevPosition.x != 0) {
          var diferenciaX = this.input.pointer1.position.x - this.input.pointer1.prevPosition.x;
          var diferenciaY = this.input.pointer1.position.y - this.input.pointer1.prevPosition.y;
  
          this.cameras.main.setScroll(this.cameras.main.x + diferenciaX, this.cameras.main.y + diferenciaY);
        }
        
      }

    }

    iniciarJugadores() {
      this.jugadores = this.physics.add.group();
      for (var i = 0; i < this.partida.numeroJugadores; i++) {
        var datosJugador = this.partida.jugadores[i];
        var jugador = new JugadorSprite(this, datosJugador);        
        this.jugadores.add(jugador,true);   
        jugador.posicionarDelante();     
        jugador.setCollideWorldBounds(true);
        jugador.setScrollFactor(0);
        jugador.inicializarFichas();
        jugador.mensajesInformacion = this.mensajesInformacion;
      }
    }

    terminarTurno(pointer, localX, localY, event) {
      
      this.partida.terminarTurno(); 
           
      this.jugadores.getChildren().forEach((jugador: JugadorSprite)=>{
        jugador.refrescarDatos();
      });
      if (!this.partida.colocandoFichas) {
        this.mapaFichas.getChildren().forEach((fichaSprite: FichaSprite) => {
          fichaSprite.reclamar();
          fichaSprite.cargarMarcadoresTropas();
        });
      }      

      if (this.partida.partidaAcabada) {
        this.game.scene.start('GameOver', <Jugador[]>this.partida.jugadores);
        this.game.scene.pause('Map');
      } else {
        this.activarJugador(this.partida.jugadorActivo.numero);
      }

      if (event)
        event.stopPropagation();
    }    

    activarJugador(indice: number) {
      if(this.jugadorActivo) {
        this.jugadorActivo.desactivar();
      }

      this.jugadorActivo = <JugadorSprite>this.jugadores.getChildren()[indice];
      this.jugadorActivo.activar();
      this.marker.lineStyle(4, this.jugadorActivo.color.color, 1);
      this.marker.strokeRect(0, 0, this.map.tileWidth * this.layer1.scaleX, this.map.tileHeight * this.layer1.scaleY);

      this.fichaColocando = this.jugadorActivo.getSiguienteFicha();
      if (this.fichaColocando) {
        
        this.mensajesInformacion.push( {color: COLOR_LETRA_BLANCO, mensaje: "Colocando ficha " + this.jugadorActivo.jugador.nombre})
        this.fichaColocando.setPosition(this.jugadorActivo.x,this.jugadorActivo.y + this.jugadorActivo.height*this.jugadorActivo.scaleY);
        this.fichaColocando.setVisible(true);
        if (this.fichaColocando.ficha.oculta)
          this.fichaColocando.tint = this.jugadorActivo.color.color;
          
        this.fichaColocando.setScrollFactor(0);
        this.fichaColocando.setDepth(1);
        this.generarZonaDeColocacion();                        
                
      } else {
        if(this.partida.colocandoFichas) {
          this.textoTerminarTurno = this.add.text(
            this.game.scale.width / 2, 
            this.jugadorActivo.y + (this.jugadorActivo.height * this.jugadorActivo.scaleY),
             "Terminar turno", 
             { fill: COLOR_LETRA_BLANCO, font: 'bold 16pt arial'});
          this.textoTerminarTurno.setInteractive();
          this.textoTerminarTurno.setStroke(COLOR_STROKE_LETRA, 2);
          this.textoTerminarTurno.setScrollFactor(0);
          this.textoTerminarTurno.setDepth(3);
          this.textoTerminarTurno.on('pointerup', this.terminarTurno, this);
        }
        this.partida.colocandoFichas = false;
        this.mensajesInformacion.push( {color: COLOR_LETRA_BLANCO, mensaje: "Turno " + this.partida.turno + " del jugador " + this.jugadorActivo.jugador.nombre})
        this.jugadorActivo.iniciarTurno();
      }

    }

    clickear(pointer, localX, localY, event) {
      var xCamera = this.cameras.main.centerX - pointer.position.x;
      var yCamera = this.cameras.main.centerY - pointer.position.y;
      var worldPoint = <Phaser.Math.Vector2>pointer.positionToCamera(this.cameras.main);
        
      if(Math.abs(xCamera) > this.map.tileWidth * 2 * this.layer1.scaleX
      || Math.abs(yCamera) > this.map.tileHeight * 2 * this.layer1.scaleY) {
        
        this.cameras.main.pan(worldPoint.x, worldPoint.y);
        worldPoint = <Phaser.Math.Vector2>pointer.positionToCamera(this.cameras.main);

      }

      var pointerTileX = this.map.worldToTileX(worldPoint.x);
      var pointerTileY = this.map.worldToTileY(worldPoint.y);

      // Snap to tile coordinates, but in world space
      this.marker.x = this.map.tileToWorldX(pointerTileX);
      this.marker.y = this.map.tileToWorldY(pointerTileY);  
      
      if (this.partida.colocandoFichas) {
       
        var tile = this.layer1.getTileAtWorldXY(worldPoint.x, worldPoint.y);
        if (tile.index == FRAME_FICHA_FONDO && tile.tint == COLOR_FICHA_ACTIVA)
        {
          //
          var indice = +this.fichaColocando.frame.name;
          tile = this.layer1.putTileAt(indice,pointerTileX, pointerTileY);
          if (this.fichaColocando.ficha.oculta) {
            tile.tint = this.jugadorActivo.color.color;
          }
          
          this.fichaColocando.colocar(this.marker.x, this.marker.y, this.jugadorActivo);
          this.fichaColocando.ficha.xTile = tile.x;
          this.fichaColocando.ficha.yTile = tile.y;
          this.mapaFichas.add(this.fichaColocando);
          this.partida.mapa.push(this.fichaColocando.ficha);
          this.borrarZonaDeColocacion();
          this.terminarTurno(pointer, localX, localY, event);
        }                                

      } else {
        
        var tile = this.layer1.getTileAtWorldXY(worldPoint.x, worldPoint.y);
          
        if (tile && (!this.tileSeleccionado || this.tileSeleccionado != tile)) {
          this.tileSeleccionado = tile;
        }

        if (this.pelotonSeleccionado)
          this.moverPeloton();
        
      }
    }

    moverPeloton() {
      var fichaOrigen = this.pelotonSeleccionado.ficha;
      
      var vTileOrigen = this.map.worldToTileXY(fichaOrigen.x, fichaOrigen.y);

      var suma = Math.abs(vTileOrigen.x - this.tileSeleccionado.x) + Math.abs(vTileOrigen.y - this.tileSeleccionado.y);

      if (suma > 1) return;

      var xBuscado = this.map.tileToWorldX(this.tileSeleccionado.x) + fichaOrigen.width / 2 * fichaOrigen.scaleX;
      var yBuscado = this.map.tileToWorldY(this.tileSeleccionado.y) + fichaOrigen.height / 2 * fichaOrigen.scaleY;           

      if (fichaOrigen.x != xBuscado || fichaOrigen.y != yBuscado) {
        var fichas = <FichaSprite[]>this.mapaFichas.getChildren();
        var fichaDestino = fichas.find( ficha => ficha.x == xBuscado && ficha.y == yBuscado);
        if (fichaDestino) {
                                                  
          this.pelotonSeleccionado.peloton.mover();                    
          fichaDestino.ficha.addTropas(this.pelotonSeleccionado.peloton.jugador, this.pelotonSeleccionado.peloton.tropas);
          fichaOrigen.ficha.deleteTropas(this.pelotonSeleccionado.peloton.jugador, this.pelotonSeleccionado.peloton.tropas);
          fichaDestino.cargarMarcadoresTropas();          
          this.reclamarFicha(fichaDestino);
          fichaDestino.reclamarTesoros(this.jugadorActivo);

          fichaOrigen.cargarMarcadoresTropas();
          this.pelotonSeleccionado.setVisible(false);
          this.pelotonSeleccionado.destroy();
          this.pelotonSeleccionado = null;
          this.voltearFichas(this.tileSeleccionado.x, this.tileSeleccionado.y);

        }
      }           
      
    }

    reclamarFicha(fichaSprite: FichaSprite) {
      if (fichaSprite.reclamar()) { 
        this.partida.reclamarFicha(fichaSprite.ficha);                   
      }
    }

    voltearFichas(x:number, y:number) {
      for(var i = x -1; i <= x +1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          this.voltearFicha(i, j);
        }
      }

      this.comprobarUltimoTurno();

    }

    comprobarUltimoTurno() {
      if(this.partida.esUltimoTurno())
        this.mensajesInformacion.push({color: COLOR_LETRA_BLANCO, mensaje: "Último turno"});
    }

    voltearFicha(x:number, y:number) {
      var xBuscado = this.map.tileToWorldX(x) + this.map.tileWidth / 2 * this.layer1.scaleX;
      var yBuscado = this.map.tileToWorldY(y) + this.map.tileHeight / 2 * this.layer1.scaleY;           

      var fichas = <FichaSprite[]>this.mapaFichas.getChildren();      
      var fichaBuscada = fichas.find( ficha => ficha.x == xBuscado && ficha.y == yBuscado);
      if (fichaBuscada && fichaBuscada.ficha.oculta) {
        this.jugadorActivo.jugador.setPuntos(1);
        this.jugadorActivo.refrescarDatos();
        fichaBuscada.voltear();
      }
      
    }

    borrarZonaDeColocacion() {
      var tiles = this.map.filterTiles((tile:Phaser.Tilemaps.Tile) => { 
        if (tile.index == FRAME_FICHA_FONDO)
         return tile;
      });

      tiles.forEach(tile => {
        tile.tint = COLOR_FICHA_NO_ACTIVA;
      });

    }

    generarZonaDeColocacion() {
        var puntos = this.jugadorActivo.getZonaColocacion();

        if (puntos.length == 0) {
          if (this.jugadorActivo.jugador.numero == 0) {
            var tile = this.map.getTileAt(Math.floor(this.map.width/2),Math.floor(this.map.height / 2));
            var punto = new Phaser.Math.Vector2(this.map.tileToWorldX(tile.x), this.map.tileToWorldY(tile.y));
            puntos.push(punto);
          } else {
            var jugadores = <JugadorSprite[]>this.jugadores.getChildren();
            puntos = jugadores[this.jugadorActivo.jugador.numero-1].getZonaColocacion();
          }
        }        
        
        puntos.forEach((punto: Phaser.Math.Vector2) => {
          var tile = this.map.getTileAtWorldXY(punto.x, punto.y);
          if (tile.index == FRAME_FICHA_FONDO && tile.tint != COLOR_FICHA_ACTIVA) {
            tile.tint = COLOR_FICHA_ACTIVA;
          }
        });
        
    }    

    actualizarTextoInformacion() {
      
      if (this.textoInformacion.alpha == 0 && this.mensajesInformacion.length > 0) {
        var mensajeInformacion = this.mensajesInformacion.splice(0,1).pop();        
        this.textoInformacion.setFill(mensajeInformacion.color);
        this.textoInformacion.text = mensajeInformacion.mensaje;
        this.textoInformacion.setAlpha();
      } else {
        this.textoInformacion.alpha -= (this.mensajesInformacion.length + 1) * 0.01;
      }

    }

    onDragStop(pointer, sprite) {
      
      
    
    }
    
}
