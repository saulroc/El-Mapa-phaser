import { Jugador } from './jugador';
import { Ficha } from './ficha';

describe('agregarMina', () => {
    let jugador: Jugador;
    let mina: Ficha;

    beforeEach(() => {
        jugador = new Jugador('Paco', '#000000', 0, false);
        mina = new Ficha(1, 'Prueba', 1, false, true);

    });

    it('añadir una mina al conjunto', () =>{
        
        jugador.agregarMina(mina);

        expect(jugador.minas).toContain(mina);
        expect(jugador.minas.length).toBe(1);
    });

    it('intentar añadir una mina repetida al conjunto', () =>{
        
        jugador.agregarMina(mina);
        jugador.agregarMina(mina);

        expect(jugador.minas).toContain(mina);
        expect(jugador.minas.length).toBe(1);
    });
});

describe('quitarMina', () => {
    let jugador: Jugador;
    let mina: Ficha;
    let mina2: Ficha;

    beforeEach(() => {
        jugador = new Jugador('Paco', '#000000', 0, false);
        mina2 = new Ficha(1, 'Prueba 2', 1, false, true);
        mina = new Ficha(1, 'Prueba', 1, false, true);

    });

    it('quitar una mina al conjunto lo debe reducir', () =>{

        jugador.agregarMina(mina);
        jugador.quitarMina(mina);

        expect(jugador.minas).not.toContain(mina);
        expect(jugador.minas.length).toBe(0);

    });

    it('quitar una mina que no existe del conjuto lo debe dejar igual', () =>{        
        
        jugador.agregarMina(mina);
        jugador.quitarMina(mina2);

        expect(jugador.minas).not.toContain(mina2);
        expect(jugador.minas).toContain(mina);        
        expect(jugador.minas.length).toBe(1);
    });
});