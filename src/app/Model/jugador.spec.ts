import { Jugador } from './jugador';
import { Ficha } from './ficha';
import { Pueblo } from './pueblo';

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


describe('agregarPueblo', () => {
    let jugador: Jugador;
    let pueblo: Pueblo;
    let pueblo2: Pueblo;

    beforeEach(() => {
        jugador = new Jugador('Paco', '#000000', 0, false);
        pueblo = new Pueblo('#000000');
        pueblo2 = new Pueblo('#000000');

    });

    it('Agregar un pueblo a un jugador debe aumentar los pueblos del jugador, los puntos y el numero de pelotones que puede mover', () =>{
        spyOn(pueblo, 'getPuntos').and.callFake(() => {
            return 1;
        })
        jugador.agregarPueblo(pueblo);

        expect(jugador.pueblos).toContain(pueblo);
        expect(jugador.pueblos.length).toBe(1);
        expect(jugador.maximoPelotonesMoviendo).toBe(1);
        expect(jugador.puntos).toBe(1);

    });

    it('Agregar un pueblo que ya existe debe dejar al jugador igual', () =>{        
        spyOn(pueblo, 'getPuntos').and.callFake(() => {
            return 1;
        })
        jugador.agregarPueblo(pueblo);
        jugador.agregarPueblo(pueblo);

        expect(jugador.pueblos).toContain(pueblo);
        expect(jugador.pueblos.length).toBe(1);
        expect(jugador.maximoPelotonesMoviendo).toBe(1);
        expect(jugador.puntos).toBe(1);

    });
});

describe('quitarPueblo', () => {
    let jugador: Jugador;
    let pueblo: Pueblo;
    let pueblo2: Pueblo;

    beforeEach(() => {
        jugador = new Jugador('Paco', '#000000', 0, false);
        pueblo = new Pueblo('#000000');
        pueblo2 = new Pueblo('#000000');

    });

    it('Quitar un pueblo a un jugador debe reducir los pueblos del jugador, los puntos y el numero de pelotones que puede mover', () =>{
        spyOn(pueblo, 'getPuntos').and.callFake(() => {
            return 1;
        })

        jugador.agregarPueblo(pueblo);
        jugador.quitarPueblo(pueblo);

        expect(jugador.pueblos).not.toContain(pueblo);
        expect(jugador.pueblos.length).toBe(0);
        expect(jugador.maximoPelotonesMoviendo).toBe(0);
        expect(jugador.puntos).toBe(0);

    });

    it('Quitar un pueblo que ya no existe debe dejar al jugador igual', () =>{        
        let spy = spyOn(pueblo, 'getPuntos').and.returnValue(1);

        jugador.agregarPueblo(pueblo);
        jugador.quitarPueblo(pueblo2);

        expect(jugador.pueblos).toContain(pueblo);
        expect(jugador.pueblos.length).toBe(1);
        expect(jugador.maximoPelotonesMoviendo).toBe(1);
        expect(jugador.puntos).toBe(1);
        //expect(spy).toHaveBeenCalled();

    });
});

describe('esPropietario', () => {
    let jugador: Jugador;
    let pueblo: Pueblo;
    let pueblo2: Pueblo;

    beforeEach(() => {
        jugador = new Jugador('Paco', '#000000', 0, false);
        pueblo = new Pueblo('#000000');
        pueblo2 = new Pueblo('#000000');
        jugador.agregarPueblo(pueblo);

    });

    it('Comprobamos con un pueblo que pertenece al jugador que la funcion indica que es propietario', () =>{
        let resultado = jugador.esPropietario(pueblo);

        expect(resultado).toBeTruthy();        

    });

    it('Comprobamos con un pueblo que NO pertenece al jugador como la funcion indica que no es propietario', () =>{        
        let resultado = jugador.esPropietario(pueblo2);

        expect(resultado).not.toBeTruthy();

    });
});