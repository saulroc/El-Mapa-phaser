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
    pelotonesMoviendo: number;
    maximoPelotonesMoviendo: number;

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
        this.maximoPelotonesMoviendo = 0;


    }

    iniciarTurno() {
        
        this.pueblos.forEach(pueblo => { 
            pueblo.iniciarTurno(); 
            this.oro += pueblo.oroGenera;
        });
        this.minas.forEach(mina => {
            switch (true) {
                case mina.minaMadera:
                    this.madera++;
                    break;
                case mina.minaPiedra:
                    this.piedra++;
                    break;
                case mina.minaOro:
                    this.oro++;
                    break;
                case mina.minaTecnologia>0:
                    this.robarCarta(mina.minaTecnologia);
                    break;                
            }
        })
        this.pelotonesMoviendo = 0;
        
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

    robarCarta(nivel: number) {

    }

    agregarPueblo(pueblo: Pueblo) {
        if(this.pueblos.indexOf(pueblo) < 0) {
            this.maximoPelotonesMoviendo++;
            this.pueblos.push(pueblo);
            this.puntos += pueblo.getPuntos();
        }            
    }

    quitarPueblo(pueblo: Pueblo) {
        var indice = this.pueblos.indexOf(pueblo);
        if(indice >= 0) {
            this.pueblos.splice(indice, 1);
            this.puntos -= pueblo.getPuntos();
            this.maximoPelotonesMoviendo--;
        }
    }

    esPropietario(pueblo:Pueblo) {
        var indice = this.pueblos.indexOf(pueblo);
        return indice >= 0;
    }

    public setOro(incremento: number) {
        this.oro += incremento;        
    }

    public setMadera(incremento: number) {
        this.madera += incremento;        
    }

    public setPiedra(incremento: number) {
        this.piedra += incremento;
    }

    public setPuntos(incremento: number) {
        this.puntos += incremento;
    }

    puedeComprar(oroPedido: number, maderaPedida: number = 0, piedraPedida: number = 0) {
        return this.oro >= oroPedido
            && this.madera >= maderaPedida
            && this.piedra >= piedraPedida;
    }

    puedeMoverNuevoPeloton() {
        return this.pelotonesMoviendo < this.maximoPelotonesMoviendo;
    }
}