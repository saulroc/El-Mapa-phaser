import { Jugador } from "./jugador";
import { Ficha } from "./ficha";
import { Peloton } from "./peloton";
import { ini_jugadores } from "./datosIniciales";

export class Partida {

    jugadores: Jugador[];
    jugadorActivo: Jugador;
    numeroJugadores: number;
    turno: number = 1;
    colocandoFichas: boolean;
    mapa: Ficha[];
    pelotonSeleccionado: Peloton;
    ultimoTurno: boolean = false;
    partidaAcabada: boolean = false;

    /**
     *
     */
    constructor() {
        this.mapa = [];
        this.numeroJugadores = ini_jugadores.length;
        this.partidaAcabada = false;
    }

    iniciarJugadores() {
        this.jugadores = [];
        for (var i = 0; i < this.numeroJugadores; i++) {
            var datosJugador = new Jugador(ini_jugadores[i].nombre, ini_jugadores[i].color, i, ini_jugadores[i].cpu);
            this.jugadores.push(datosJugador);             
        }
        this.jugadorActivo = this.jugadores[0];
    }

    terminarTurno() {
        this.mapa.forEach((ficha: Ficha) => {
            var pelotonesCombate = ficha.getPelotonesCombate();
            if (pelotonesCombate) {
              this.resolverCombate(pelotonesCombate);
              //fichaSprite.cargarMarcadoresTropas();
              this.reclamarFicha(ficha);          
              //ficha.reclamarTesoros(this.jugadorActivo);
            }
    
            ficha.pelotones.forEach(peloton => peloton.iniciarTurno())
        });
        var jugador = this.getSiguienteJugador();
          
          
        if (!this.ultimoTurno || jugador.numero != 0)
            this.activarJugador(jugador); 
        else
            this.partidaAcabada = true;
    }

    getSiguienteJugador() {
        var indice = this.jugadores.indexOf(this.jugadorActivo);
        indice = (indice + 1) % this.jugadores.length;
        if(indice == 0 && !this.colocandoFichas)
            this.turno++;

        return this.jugadores[indice];
    } 
    
    activarJugador(jugador: Jugador) {
        // if(this.jugadorActivo) {
        //   this.jugadorActivo.desactivar();
        // }
  
        this.jugadorActivo = jugador;
        // jugador.activar();
        // this.marker.lineStyle(4, jugador.color.color, 1);
        // this.marker.strokeRect(0, 0, this.map.tileWidth * this.layer1.scaleX, this.map.tileHeight * this.layer1.scaleY);
  
        // this.fichaColocando = jugador.getSiguienteFicha();
        // if (this.fichaColocando) {
          
        //   this.mensajesInformacion.push( {color: COLOR_LETRA_BLANCO, mensaje: "Colocando ficha " + jugador.jugador.nombre})
        //   this.fichaColocando.setPosition(jugador.x,jugador.y + jugador.height*jugador.scaleY);
        //   this.fichaColocando.setVisible(true);
        //   if (this.fichaColocando.ficha.oculta)
        //     this.fichaColocando.tint = jugador.color.color;
            
        //   this.fichaColocando.setScrollFactor(0);
        //   this.fichaColocando.setDepth(1);
        //   this.generarZonaDeColocacion();                        
                  
        // } else {
        //   if(this.colocandoFichas) {
        //     this.textoTerminarTurno = this.add.text(
        //       this.game.scale.width / 2, 
        //       this.jugadorActivo.y + (this.jugadorActivo.height * this.jugadorActivo.scaleY),
        //        "Terminar turno", 
        //        { fill: COLOR_LETRA_BLANCO, font: 'bold 16pt arial'});
        //     this.textoTerminarTurno.setInteractive();
        //     this.textoTerminarTurno.setStroke(COLOR_STROKE_LETRA, 2);
        //     this.textoTerminarTurno.setScrollFactor(0);
        //     this.textoTerminarTurno.setDepth(3);
        //     this.textoTerminarTurno.on('pointerup', this.terminarTurno, this);
        //   }
        //   this.colocandoFichas = false;
        //   this.mensajesInformacion.push( {color: COLOR_LETRA_BLANCO, mensaje: "Turno " + this.turno + " del jugador " + jugador.jugador.nombre})
        //   this.jugadorActivo.iniciarTurno();
        // }
  
      }

    reclamarFicha(ficha: Ficha) {
        if (ficha.sePuedeReclamar()) { 
                    
            if(ficha.tieneMina()) {
                this.jugadores.forEach((jugador) => { jugador.quitarMina(ficha);});
                this.jugadorActivo.agregarMina(ficha);
            } else if (ficha.pueblo) {
                if(this.jugadorActivo.pueblos.indexOf(ficha.pueblo) < 0)
                    this.jugadorActivo.pueblos.push(ficha.pueblo);
            }
        }
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
                jugador.puntos += puntos;
            }
  
          }
        }
  
  
    }

    esUltimoTurno() {
      for(var i = 0; i < this.mapa.length; i++) {
        if (this.mapa[i].oculta) {
          this.ultimoTurno = false;
          return this.ultimoTurno;
        }
      }

      this.ultimoTurno = true;
      return this.ultimoTurno;
    }

}