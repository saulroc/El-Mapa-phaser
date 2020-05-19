import { Jugador } from './jugador';
import { Ficha } from './ficha';

describe('agregarMina', () => {
    let jugador: Jugador;
    let mina: Ficha;

    it('añadir una mina al conjunto', () =>{
        jugador = new Jugador('Paco', '#000000', 0, false);
        mina = new Ficha(1, 'Prueba', 1, false, true);

        jugador.agregarMina(mina);
        expect(jugador.minas.length).toBe(1);
    });

    it('intentar añadir una mina repetida al conjunto', () =>{
        jugador = new Jugador('Paco', '#000000', 0, false);
        mina = new Ficha(1, 'Prueba', 1, false, true);
        
        jugador.agregarMina(mina);
        jugador.agregarMina(mina);
        expect(jugador.minas.length).toBe(1);
    });
});

describe('quitarMina', () => {
    let jugador: Jugador;
    let mina: Ficha;

    it('quitar una mina al conjunto', () =>{
        jugador = new Jugador('Paco', '#000000', 0, false);
        mina = new Ficha(1, 'Prueba', 1, false, true);

        jugador.agregarMina(mina);
        expect(jugador.minas.length).toBe(1);
    });

    it('intentar añadir una mina repetida al conjunto', () =>{
        jugador = new Jugador('Paco', '#000000', 0, false);
        mina = new Ficha(1, 'Prueba', 1, false, true);
        
        jugador.agregarMina(mina);
        jugador.agregarMina(mina);
        expect(jugador.minas.length).toBe(1);
    });
});