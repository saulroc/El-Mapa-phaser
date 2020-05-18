import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';
import { Ficha } from '../Model/ficha';
import { PelotonSprite } from '../Model/pelotonSprite';
import { Peloton } from '../Model/peloton';

import GesturesPlugin from 'phaser3-rex-plugins/plugins/gestures-plugin.js';

var ini_jugadores = [{
  nombre: 'Jugador 1',
  cpu: false,
  color: "0xff0000"
},
{
  nombre: 'Jugador 2',
  cpu: false,
  color: "0x0000ff"
}/*,
{
  nombre: 'CPU 1',
  cpu: true,
  color: "0x008000"
}*/];

const FRAME_FICHA_FONDO = 44;
const COLOR_LETRA_BLANCO = '#FFFFFF';
const COLOR_STROKE_LETRA = '#000000';
const COLOR_FICHA_ACTIVA = 0xf4d03f;
const COLOR_FICHA_NO_ACTIVA = 0xffffff;


@Injectable({
  providedIn: 'root'
})
export class MapSceneService extends Phaser.Scene {
    
    sceneWidthHalf: number;
    mapa: Phaser.Physics.Arcade.Group;
    //zonaColocacion: Phaser.Physics.Arcade.Group;
    jugadores: Phaser.Physics.Arcade.Group; //Jugador[];
    jugadorActivo: Jugador;
    fichaColocando: Ficha;
    numeroJugadores: number;

    turno: number = 1;
    colores = ["0xff0000", "0x0000ff", "0x008000", "0xffff00", "0xD2B48C", "0xff4500", "0x800080", "0x00ffff"];
    colocandoFichas: boolean;
    controls;
    textoInformacion: Phaser.GameObjects.Text;
    mensajesInformacion: {color: string, mensaje: string}[];
    textoInformacionOroGanado: Phaser.GameObjects.Text;
    textoInformacionMaderaGanada: Phaser.GameObjects.Text;
    textoInformacionPiedraGanada: Phaser.GameObjects.Text;
    textoInformacionPuntosGanados: Phaser.GameObjects.Text;
    textoTerminarTurno: Phaser.GameObjects.Text;
    marker: Phaser.GameObjects.Graphics;
    map: Phaser.Tilemaps.Tilemap;
    layer1: Phaser.Tilemaps.DynamicTilemapLayer;
    tileSet: Phaser.Tilemaps.Tileset;
    tileSeleccionado: Phaser.Tilemaps.Tile;
    pelotonSeleccionado: PelotonSprite;
    ultimoTurno: boolean = false;

    distancia: number;
    distanciaAnterior: number;
    distanciaDelta: number;
    escalarMundo: number;

    public constructor() {
      super({ key: 'Map' });
      this.numeroJugadores = ini_jugadores.length;
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
      
      this.map = this.make.tilemap({ tileWidth: 413, tileHeight: 413, width: 20 * this.numeroJugadores, height: 20 * this.numeroJugadores});
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

      this.colocandoFichas = true;
      this.mapa = this.physics.add.group();
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

      this.cameras.main.setScroll(this.physics.world.bounds.centerX - this.cameras.main.width / 2, this.physics.world.bounds.centerY  - this.cameras.main.height / 2)
      this.input.addPointer(1);
      this.activarJugador(<Jugador>this.jugadores.getChildren()[0]);
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
      if(punteros.length >= 2 && punteros[0].isDown && punteros[1].isDown) {
        this.mensajesInformacion.push({color: COLOR_LETRA_BLANCO, mensaje: "2 Punteros Down"});
        this.mensajesInformacion.push({color: COLOR_LETRA_BLANCO, mensaje: "Puntero 1 X: " + punteros[0].x + ", Y:" + punteros[0].y});
        this.mensajesInformacion.push({color: COLOR_LETRA_BLANCO, mensaje: "Puntero 2 X: " + punteros[1].x + ", Y:" + punteros[1].y});


        this.distanciaAnterior = this.distancia;    
        this.distancia = Phaser.Math.Distance.Between(punteros[0].x, punteros[0].y, punteros[1].x,punteros[1].y);
        this.distanciaDelta = Math.abs(this.distanciaAnterior - this.distancia);        
        if (this.distanciaAnterior > this.distancia && this.distanciaDelta > 2) { 
          this.escalarMundo -= 0.02; 
        } else if (this.distanciaAnterior < this.distancia && this.distanciaDelta > 2){ 
          this.escalarMundo += 0.02;
        }  
          
        this.escalarMundo = Phaser.Math.Clamp(this.escalarMundo, 0.5, 2); // set a minimum and maximum scale value    
        this.mensajesInformacion.push({color: COLOR_LETRA_BLANCO, mensaje: "Escalar : " + this.escalarMundo});
        
        if (this.escalarMundo<2){        
          this.cameras.main.setZoom(this.escalarMundo);
          // zoomed=true;        
          // stageGroup.scale.set(this.escalarMundo);        
          // if (follow){            
          //   ease=0.1;            
          //   cameraPos.x += (follow.x * this.escalarMundo- cameraPos.x) * ease ;
          //   cameraPos.y += (follow.y * this.escalarMundo- cameraPos.y) * ease ;
          //   game.camera.focusOnXY(cameraPos.x, cameraPos.y);        
          // }
        }          
      } if (punteros.length >= 1 && punteros[0].isDown) {
        var diferenciaX = punteros[0].position.x - punteros[0].prevPosition.x;
        var diferenciaY = punteros[0].position.y - punteros[0].prevPosition.y;

        this.cameras.main.setScroll(this.cameras.main.x - diferenciaX, this.cameras.main.y - diferenciaY);
      }

    }

    iniciarJugadores() {
      this.jugadores = this.physics.add.group();
      for (var i = 0; i < this.numeroJugadores; i++) {
        var datosJugador = ini_jugadores[i];
        var color = Phaser.Display.Color.HexStringToColor(datosJugador.color);        
        var jugador = new Jugador(this, color, datosJugador.nombre, i, datosJugador.cpu);        
        this.jugadores.add(jugador,true);   
        jugador.posicionarDelante();     
        jugador.setCollideWorldBounds(true);
        jugador.setScrollFactor(0);
        jugador.inicializarFichas();
        jugador.mensajesInformacion = this.mensajesInformacion;
      }
    }

    terminarTurno(pointer, localX, localY, event) {
      
      this.mapa.getChildren().forEach((ficha: Ficha) => {
        var pelotonesCombate = ficha.getPelotonesCombate();
        if (pelotonesCombate) {
          this.resolverCombate(pelotonesCombate);
          ficha.cargarMarcadoresTropas();
          this.reclamarFicha(ficha);          
          ficha.reclamarTesoros(this.jugadorActivo);
        }

        ficha.pelotones.forEach(peloton => peloton.iniciarTurno())
      });
      var jugador = this.getSiguienteJugador();
      if (this.ultimoTurno && jugador.numero == 0) {
        this.game.scene.start('GameOver', <Jugador[]>this.jugadores.getChildren());
        this.game.scene.pause('Map');
      }

      this.activarJugador(jugador);   
      
      if (event)
        event.stopPropagation();
    }    

    getSiguienteJugador() {
      var jugadoresVector = this.jugadores.getChildren();  
      var indice = jugadoresVector.indexOf(this.jugadorActivo);
      indice = (indice + 1) % jugadoresVector.length;
      if(indice == 0 && !this.colocandoFichas)
        this.turno++;

      return <Jugador>jugadoresVector[indice];
    }  

    activarJugador(jugador: Jugador) {
      if(this.jugadorActivo) {
        this.jugadorActivo.desactivar();
      }

      this.jugadorActivo = jugador;
      jugador.activar();
      this.marker.lineStyle(4, jugador.color.color, 1);
      this.marker.strokeRect(0, 0, this.map.tileWidth * this.layer1.scaleX, this.map.tileHeight * this.layer1.scaleY);

      this.fichaColocando = jugador.getSiguienteFicha();
      if (this.fichaColocando) {
        
        this.mensajesInformacion.push( {color: COLOR_LETRA_BLANCO, mensaje: "Colocando ficha " + jugador.nombre})
        this.fichaColocando.setPosition(jugador.x,jugador.y + jugador.height*jugador.scaleY);
        this.fichaColocando.setVisible(true);
        if (this.fichaColocando.oculta)
          this.fichaColocando.tint = jugador.color.color;
          
        this.fichaColocando.setScrollFactor(0);
        this.fichaColocando.setDepth(1);
        this.generarZonaDeColocacion();                        
                
      } else {
        if(this.colocandoFichas) {
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
        this.colocandoFichas = false;
        this.mensajesInformacion.push( {color: COLOR_LETRA_BLANCO, mensaje: "Turno " + this.turno + " del jugador " + jugador.nombre})
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
      
      if (this.colocandoFichas) {
       
        var tile = this.layer1.getTileAtWorldXY(worldPoint.x, worldPoint.y);
        if (tile.index == FRAME_FICHA_FONDO && tile.tint == COLOR_FICHA_ACTIVA)
        {
          //
          var indice = +this.fichaColocando.frame.name;
          tile = this.layer1.putTileAt(indice,pointerTileX, pointerTileY);
          if (this.fichaColocando.oculta) {
            tile.tint = this.jugadorActivo.color.color;
          }
          
          this.fichaColocando.colocar(this.marker.x, this.marker.y, this.jugadorActivo);
          this.mapa.add(this.fichaColocando);
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

      if (Math.abs(vTileOrigen.x - this.tileSeleccionado.x) > 1 ||
        Math.abs(vTileOrigen.y - this.tileSeleccionado.y) > 1) return;

      var xBuscado = this.map.tileToWorldX(this.tileSeleccionado.x) + fichaOrigen.width / 2 * fichaOrigen.scaleX;
      var yBuscado = this.map.tileToWorldY(this.tileSeleccionado.y) + fichaOrigen.height / 2 * fichaOrigen.scaleY;           

      if (fichaOrigen.x != xBuscado || fichaOrigen.y != yBuscado) {
        var fichas = <Ficha[]>this.mapa.getChildren();
        var fichaDestino = fichas.find( ficha => ficha.x == xBuscado && ficha.y == yBuscado);
        if (fichaDestino) {
          this.pelotonSeleccionado.peloton.mover();                    
          fichaDestino.addTropas(this.pelotonSeleccionado.peloton.jugador, this.pelotonSeleccionado.peloton.tropas);
          fichaOrigen.deleteTropas(this.pelotonSeleccionado.peloton.jugador, this.pelotonSeleccionado.peloton.tropas);
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

    reclamarFicha(ficha: Ficha) {
      if (ficha.reclamar()) {            
        if(ficha.tieneMina()) {
          this.jugadores.getChildren().forEach((jugador: Jugador) => { jugador.quitarMina(ficha);});
          this.jugadorActivo.agregarMina(ficha);
        } else if (ficha.pueblo) {
          if(this.jugadorActivo.pueblos.indexOf(ficha.pueblo) < 0)
            this.jugadorActivo.pueblos.push(ficha.pueblo);
        }
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
      var fichas = <Ficha[]>this.mapa.getChildren();     
      for(var i = 0; i < fichas.length; i++) {
        if (fichas[i].oculta) {
          this.ultimoTurno = false;
          return;
        }
      }

      this.ultimoTurno = true;
      this.mensajesInformacion.push({color: COLOR_LETRA_BLANCO, mensaje: "Último turno"});
    }

    voltearFicha(x:number, y:number) {
      var xBuscado = this.map.tileToWorldX(x) + this.map.tileWidth / 2 * this.layer1.scaleX;
      var yBuscado = this.map.tileToWorldY(y) + this.map.tileHeight / 2 * this.layer1.scaleY;           

      var fichas = <Ficha[]>this.mapa.getChildren();      
      var fichaBuscada = fichas.find( ficha => ficha.x == xBuscado && ficha.y == yBuscado);
      if (fichaBuscada && fichaBuscada.oculta) {
        this.jugadorActivo.incrementarPuntos(1);
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
          if (this.jugadorActivo.numero == 0) {
            var tile = this.map.getTileAt(Math.floor(this.map.width/2),Math.floor(this.map.height / 2));
            var punto = new Phaser.Math.Vector2(this.map.tileToWorldX(tile.x), this.map.tileToWorldY(tile.y));
            puntos.push(punto);
          } else {
            var jugadores = <Jugador[]>this.jugadores.getChildren();
            puntos = jugadores[this.jugadorActivo.numero-1].getZonaColocacion();
          }
        }        
        
        puntos.forEach((punto: Phaser.Math.Vector2) => {
          var tile = this.map.getTileAtWorldXY(punto.x, punto.y);
          if (tile.index == FRAME_FICHA_FONDO && tile.tint != COLOR_FICHA_ACTIVA) {
            tile.tint = COLOR_FICHA_ACTIVA;
          }
        });
        
    } 
  
    resolverCombate(pelotones: Peloton[]) {
      var velocidadMaxima = 0;
      pelotones.forEach(peloton => {
        var velocidadMaximaPeloton = peloton.obtenerVelocidadMaxima();
        if (velocidadMaximaPeloton > velocidadMaxima)
          velocidadMaxima = velocidadMaximaPeloton;
      });

      while (pelotones.length > 1) {
        for (var i = velocidadMaxima; i >= 1; i--) {
          var heridas = [];
          pelotones.forEach(peloton => {
            var herida = peloton.obtenerHeridasProvocadas(i);
            heridas.push({ herida: herida, jugador: peloton.jugador});
          });
          var contadorPeloton = 0;
          for (var j = 0; j < heridas.length; j++) {
            var peloton = pelotones[contadorPeloton];
            var puntos = peloton.repartirHeridasSufridas(heridas[heridas.length - 1 - j].herida);
            if (peloton.tropas.length == 0) {
              pelotones.splice(contadorPeloton,1);
            } else {
              contadorPeloton++;
            }
            var jugador = heridas[heridas.length - 1 - j].jugador;
            if (puntos > 0 && jugador)
              jugador.incrementarPuntos(puntos);
          }

        }
      }


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
