import { Pueblo } from "./pueblo";
import { Peloton } from "./peloton";
import { Ficha } from "./ficha";
import { Edificio } from "./edificio";


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
    pelotones: Peloton[];

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
        this.fichas = [];
        
        this.activo = false;
        this.pelotonesMoviendo = 0;
        this.maximoPelotonesMoviendo = 0;
        this.pelotones = [];

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
            this.maximoPelotonesMoviendo += pueblo.getNumeroPelotonesMovibles();
            this.pueblos.push(pueblo);
            this.puntos += pueblo.getPuntos();
        }            
    }

    quitarPueblo(pueblo: Pueblo) {
        var indice = this.pueblos.indexOf(pueblo);
        if(indice >= 0) {
            this.pueblos.splice(indice, 1);
            this.puntos -= pueblo.getPuntos();
            this.maximoPelotonesMoviendo-= pueblo.getNumeroPelotonesMovibles();
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

    refrescarMaximoPelotonesMoviendo() {
        var cantidad = 0;
        this.pueblos.forEach(pueblo => {
            cantidad += pueblo.getNumeroPelotonesMovibles();
        });
        if (cantidad != this.maximoPelotonesMoviendo && cantidad > 0) {
            this.maximoPelotonesMoviendo = cantidad;
        }
    }

    obtenerZonaDeColocacion() {
        var puntos : {x: number, y: number}[] = [];

        this.fichas.forEach((ficha: Ficha) => {
            if (ficha.colocada) {
                puntos.push({x: ficha.xTile + 1, y: ficha.yTile});
                puntos.push({x: ficha.xTile, y: ficha.yTile + 1});
                puntos.push({x: ficha.xTile - 1, y: ficha.yTile});
                puntos.push({x: ficha.xTile, y: ficha.yTile - 1});                
            }
        });
        var i = 0;
        while (i < puntos.length) {
            var fichaBuscada = this.fichas.find( ficha => ficha.colocada && ficha.xTile == puntos[i].x && ficha.yTile == puntos[i].y);
            if (fichaBuscada)
                puntos.splice(i, 1);
            else
                i++;
        }
        
        return puntos;
    }

    tieneAccionesPendientes(): boolean {
        var resultado = this.tieneAccionesPuebloPendientes()
            || this.puedeMoverPelotones()

        return resultado;
    }

    tieneAccionesPuebloPendientes(): boolean {
        return (this.tieneRecursos() && 
        (this.puedeConstruir() != null || this.puedeComerciar() != null || this.puedeComprarTropas() != null))
    }

    tieneRecursos(): boolean {
        return this.oro > 0 || this.madera > 0 || this.piedra > 0;
    }

    puedeMoverPelotones(): boolean {
        if (this.pelotonesMoviendo < this.maximoPelotonesMoviendo && this.pelotones.find(p => p.puedeMover()) !== undefined) {
            return true;
        }

        return false;
    }

    puedeComprarTropas(): Pueblo {
        var filtrados = this.pueblos.filter((pueblo: Pueblo) => (pueblo.leva.cantidad > 0 && this.oro > 0));
        return filtrados.length > 0 ? filtrados[0] : null;
    }

    puedeComerciar(): Pueblo {
        var filtrados = this.pueblos.filter((pueblo: Pueblo) => pueblo.puedeComerciar());        
        return filtrados.length > 0 ? filtrados[0] : null;
    }

    puedeConstruir(): Pueblo {
        var puebloEncontrado: Pueblo = null;
        this.pueblos.forEach((pueblo: Pueblo) => {
            if (!pueblo.construido) {
                pueblo.edificios.forEach((edificio: Edificio) => {
                    if (!edificio.estaConstruido()) {
                        var resultado = this.puedeComprar(edificio.oro, edificio.madera, edificio.piedra);
                        if (resultado) 
                            puebloEncontrado = pueblo;
                    }
                });                             
            }
        });
        return puebloEncontrado;
    }
}