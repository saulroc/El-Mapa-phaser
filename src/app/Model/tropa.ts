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
    coste?: {oro: number, madera:number, piedra:number }

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

        switch (this.tipo) {
            case 'leva':
                this.nivel = 1
                this.coste = {oro: 1, madera: 0, piedra: 0};
                break;
            case 'soldado':
                this.nivel = 2
                this.coste = {oro: 2, madera: 0, piedra: 0};
                break;
            case 'arquero':
                this.nivel = 3
                this.coste = {oro: 2, madera: 0, piedra: 0};
                break;
            case 'caballero':
                this.nivel = 4
                this.coste = {oro: 2, madera: 1, piedra: 0};
                break;  
            default:
                this.nivel = 1
                this.coste = {oro: 1, madera: 0, piedra: 0};
                break;
        }
    }
}