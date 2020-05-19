import { Pueblo } from "./pueblo";
import { Peloton } from "./peloton";
import { Ficha } from "./ficha";


export class Jugador {
    nombre: string;
    color: string;
    CPU: boolean;
    pueblos: Pueblo[] = [];
    activo: boolean;
    madera: number;
    oro: number;
    piedra: number;
    puntos: number;
    numero: number;
    fichas: Ficha[];
    minas: Ficha[];
    pelotonesMoviendo: Peloton[];

    /**
     *
     */
    constructor( nombre: string, color: string, numero: number, cpu: boolean) {
        this.nombre = nombre;
        this.color = color;
        this.numero = numero;
        this.CPU = cpu;
        
        this.oro = 2;
        this.piedra = 0;
        this.madera = 0;
        this.puntos = 0;
        this.minas = [];

        this.activo = false;


    }

    iniciarTurno() {
        var incrementoOro = 0;
        var incrementoMadera = 0;
        var incrementoPiedra = 0;

        this.pueblos.forEach(pueblo => { 
            pueblo.iniciarTurno(); 
            incrementoOro += pueblo.oroGenera;
        });
        this.minas.forEach(mina => {
            switch (true) {
                case mina.minaMadera:
                    incrementoMadera++;
                    break;
                case mina.minaPiedra:
                    incrementoPiedra++;
                    break;
                case mina.minaOro:
                    incrementoOro++;
                    break;                
            }
        })
        this.pelotonesMoviendo = [];

        return [incrementoOro, incrementoMadera, incrementoPiedra];
    }

    agregarMina(mina: Ficha) {
        if (this.minas.indexOf(mina) < 0)
            this.minas.push(mina);
    }

    quitarMina(mina: Ficha) {
        var indice = this.minas.indexOf(mina);
        if (indice >= 0)
            this.minas.splice(indice, 1);
    }
}