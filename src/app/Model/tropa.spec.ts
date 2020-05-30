import { Tropa, LEVA, SOLDADO, ARQUERO, CABALLERO} from './tropa';

describe ('constructuro de LEVA', () => {
    let tropa: Tropa;

    it('Al crear una LEVA el ataque debe ser 1, la vida 1, el movimiento 2, la distancia de ataque 0', () => {
        tropa = new Tropa(LEVA, 1, 0);

        expect(tropa.cantidad).toBe(1);
        expect(tropa.movido).toBe(0);
        expect(tropa.coste.oro).toBe(1);        
        expect(tropa.ataque).toBe(1);
        expect(tropa.vida).toBe(1);
        expect(tropa.velocidad).toBe(1);
        expect(tropa.movimiento).toBe(2);
        expect(tropa.distanciaDeAtaque).toBe(0);
    });
});