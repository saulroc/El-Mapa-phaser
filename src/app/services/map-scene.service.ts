import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';
import { Ficha } from '../Model/ficha';
import { PelotonSprite } from '../Model/pelotonSprite';
import { Peloton } from '../Model/peloton';

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
const COLOR_LETRA_NEGRO = '#000000';

@Injectable({
  providedIn: 'root'
})
export class MapSceneService extends Phaser.Scene {
    
    sceneWidthHalf: number;
    mapa: Phaser.Physics.Arcade.Group;
    zonaColocacion: Phaser.Physics.Arcade.Group;
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
        fill: COLOR_LETRA_NEGRO,
        align: 'center',
        wordWrap: true
       }
      this.textoInformacion = this.add.text(this.game.scale.width / 2, this.game.scale.height / 6, "", estilo);
      this.textoInformacion.setOrigin(0.5);
      this.textoInformacion.setScrollFactor(0);
      this.textoInformacion.setDepth(3);
      this.textoInformacion.text = "Cargando partida";
      
      this.iniciarJugadores();

      this.colocandoFichas = true;
      this.mapa = this.physics.add.group();
      this.zonaColocacion = this.physics.add.group();
      this.zonaColocacion.create(this.cameras.main.centerX, this.cameras.main.centerY);
        
      this.marker = this.add.graphics();
      this.marker.lineStyle(4, 0xFFFFFF, 1);
      this.marker.strokeRect(0, 0, this.map.tileWidth * this.layer1.scaleX, this.map.tileHeight * this.layer1.scaleY);

      this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

      }); 

      this.input.on('dragend', this.onDragStop, this);
      this.input.on('pointerup', this.clickear, this);

      this.activarJugador(<Jugador>this.jugadores.getChildren()[0]);
      this.cameras.main.setScroll(this.physics.world.bounds.centerX, this.physics.world.bounds.centerY)
      
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
          if (ficha.reclamar()) {
            this.jugadores.getChildren().forEach((jugador: Jugador) => { jugador.quitarMina(ficha);});
            this.jugadorActivo.agregarMina(ficha);
          }
        }

        ficha.pelotones.forEach(peloton => peloton.iniciarTurno())
      });
      this.activarJugador(this.getSiguienteJugador());   
      
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
        this.mensajesInformacion.push( {color: COLOR_LETRA_NEGRO, mensaje: "Colocando ficha " + jugador.nombre})
        this.fichaColocando.setVisible(true);
        this.fichaColocando.setDepth(1);
                
      } else {
        if(this.colocandoFichas) {
          this.textoTerminarTurno = this.add.text(
            this.game.scale.width / 2, 
            this.jugadorActivo.y + (this.jugadorActivo.height * this.jugadorActivo.scaleY),
             "Terminar turno", 
             { fill: COLOR_LETRA_NEGRO, font: 'bold 16pt arial'});
          this.textoTerminarTurno.setInteractive();
          this.textoTerminarTurno.setScrollFactor(0);
          this.textoTerminarTurno.setDepth(3);
          this.textoTerminarTurno.on('pointerup', this.terminarTurno, this);
        }
        this.colocandoFichas = false;
        this.mensajesInformacion.push( {color: COLOR_LETRA_NEGRO, mensaje: "Turno " + this.turno + " del jugador " + jugador.nombre})
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
       
        this.generarZonaDeColocacion();                

        var tile = this.layer1.getTileAtWorldXY(worldPoint.x, worldPoint.y);
        if (tile.index == FRAME_FICHA_FONDO)
        {
          //
          var indice = +this.fichaColocando.frame.name;
          tile = this.layer1.putTileAt(indice,pointerTileX, pointerTileY);
          if (this.fichaColocando.oculta) {
            tile.tint = this.jugadorActivo.color.color;
          }
          
          this.fichaColocando.colocar(this.marker.x, this.marker.y, this.jugadorActivo);
          this.mapa.add(this.fichaColocando);
          
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
          
          if (fichaDestino.reclamar()) {
            this.jugadores.getChildren().forEach((jugador: Jugador) => { jugador.quitarMina(fichaDestino);});
            this.jugadorActivo.agregarMina(fichaDestino);
          }
          fichaOrigen.cargarMarcadoresTropas();
          this.pelotonSeleccionado.setVisible(false);
          this.pelotonSeleccionado.destroy();
          this.pelotonSeleccionado = null;
          this.voltearFichas(this.tileSeleccionado.x, this.tileSeleccionado.y);

        }
      }           
      
    }

    voltearFichas(x:number, y:number) {
      for(var i = x -1; i <= x +1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          this.voltearFicha(i, j);
        }
      }
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

    generarZonaDeColocacion() {
        this.jugadorActivo.getZonaColocacion()
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
        var mensajeInformacion = this.mensajesInformacion.pop();        
        this.textoInformacion.setFill(mensajeInformacion.color);
        this.textoInformacion.text = mensajeInformacion.mensaje;
        this.textoInformacion.setAlpha();
      } else {
        this.textoInformacion.alpha -= (this.mensajesInformacion.length + 1) * 0.01;
      }

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
