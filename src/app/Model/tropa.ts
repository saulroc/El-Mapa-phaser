export const LEVA = 'leva';
export const SOLDADO = 'soldado';
export const ARQUERO = 'arquero';
export const CABALLERO = 'caballero';

export class Tropa {
    tipo: string;
    cantidad: number;
    ataque: number;
    vida: number;
    movimiento: number;
    velocidad: number;
    movido: number;
    distanciaDeAtaque: number;
    nivel: number = 1;
    heridas: number;
    coste?: {oro: number, madera:number, piedra:number }

    /**
     *
     */
    constructor(tipo: string, cantidad: number, movido: number) {
        this.tipo = tipo;
        this.cantidad = cantidad;
        this.movido = movido;
        this.heridas = 0;
        
        switch (this.tipo) {
            case LEVA:
                this.nivel = 1
                this.ataque = 1;
                this.vida = 1;
                this.movimiento = 2;
                this.velocidad = 1;
                this.distanciaDeAtaque = 0;
                this.coste = {oro: 1, madera: 0, piedra: 0};
                break;
            case SOLDADO:
                this.nivel = 2
                this.ataque = 2;
                this.vida = 2;
                this.movimiento = 2;
                this.velocidad = 1;
                this.distanciaDeAtaque = 0;
                this.coste = {oro: 2, madera: 0, piedra: 0};
                break;
            case ARQUERO:
                this.nivel = 3
                this.ataque = 1;
                this.vida = 1;
                this.movimiento = 2;
                this.velocidad = 1;
                this.distanciaDeAtaque = 1;
                this.coste = {oro: 2, madera: 0, piedra: 0};
                break;
            case CABALLERO:
                this.nivel = 4
                this.ataque = 2;
                this.vida = 3;
                this.movimiento = 3;
                this.velocidad = 2;
                this.distanciaDeAtaque = 0;
                this.coste = {oro: 2, madera: 1, piedra: 0};
                break;  
            default:
                this.nivel = 1
                this.ataque = 1;
                this.vida = 1;
                this.movimiento = 2;
                this.velocidad = 1;
                this.distanciaDeAtaque = 0;
                this.coste = {oro: 1, madera: 0, piedra: 0};
                break;
        }
    }
}