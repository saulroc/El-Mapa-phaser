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
              this.reclamarFicha(ficha);  
              if(ficha.sePuedeReclamarTesoros(this.jugadorActivo))        
                ficha.reclamarTesoros(this.jugadorActivo);
            }
    
            ficha.pelotones.forEach(peloton => peloton.iniciarTurno())
        });
        var jugador = this.getSiguienteJugador();
        
        this.esUltimoTurno();
          
        if (!this.ultimoTurno || jugador.numero != 0)
            this.activarJugador(jugador); 
        else
            this.partidaAcabada = false;
    }

    getSiguienteJugador() {
        var indice = this.jugadores.indexOf(this.jugadorActivo);
        indice = (indice + 1) % this.jugadores.length;
        if(indice == 0 && !this.colocandoFichas)
            this.turno++;

        return this.jugadores[indice];
    } 
    
    activarJugador(jugador: Jugador) {        
  
        this.jugadorActivo = jugador;        
  
    }

    reclamarFicha(ficha: Ficha) {
        if (ficha.sePuedeReclamar()) { 
                    
            if(ficha.tieneMina()) {
                this.jugadores.forEach((jugador) => { jugador.quitarMina(ficha);});
                this.jugadorActivo.agregarMina(ficha);
            } else if (ficha.pueblo) {
                this.jugadorActivo.agregarPueblo(ficha.pueblo);
                this.jugadores.forEach(jugador => {
                  if (jugador != this.jugadorActivo)
                    jugador.quitarPueblo(ficha.pueblo);
                });
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
            
            if (pelotones.length == 1) break;

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
      this.ultimoTurno = this.estanTodasLasFichasVolteadas() 
      || (this.jugadorSinPueblos() && !this.colocandoFichas);

      this.ultimoTurno = false;

      return this.ultimoTurno;
    }

    estanTodasLasFichasVolteadas() {
      for(var i = 0; i < this.mapa.length; i++) {
        if (this.mapa[i].oculta) {
          return false;
        }
      }
      return true;
    }

    jugadorSinPueblos() {
      for(var i = 0; i < this.jugadores.length; i++) {
        if(this.jugadores[i].pueblos.length == 0)
          return true;
      }

      return false;
    }

}