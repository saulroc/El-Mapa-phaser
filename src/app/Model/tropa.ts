export class Tropa {
    tipo: string;
    cantidad: number;
    ataque: number;
    vida: number;
    movimiento: number;
    velocidad: number;
    movido: number;
    distanciaDeAtaque: number;

    /**
     *
     */
    constructor(tipo: string, cantidad: number, ataque: number, vida: number, movimiento: number, movido: number, velocidad: number, distancia: number) {
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.ataque = ataque;
        this.vida = vida;
        this.movimiento = movimiento;
        this.movido = movido;
        this.velocidad = velocidad;
        this.distanciaDeAtaque = distancia;
    }
}