import { Peloton } from './peloton';
import { Jugador } from './jugador';
import { Tropa, LEVA, SOLDADO, CABALLERO, ARQUERO } from './tropa';

describe('agregarTropa', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        soldado = new Tropa(SOLDADO, 1, 0);

    });

    it('Agregar una tropa nueva debe incluir la tropa añadida en el conjunto de tropas pero no el objeto', () =>{
        
        peloton.agregarTropa(tropa);

        expect(peloton.tropas.length).toBe(1);
        expect(peloton.tropas[0]).not.toBe(tropa);
        expect(peloton.tropas[0].tipo).toBe(LEVA);
        expect(peloton.tropas[0].cantidad).toBe(1);
    });

    it('Agregar una tropa que ya existe debe aumentar la cantidad de tropas de ese tipo', () =>{
        
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(tropa);

        expect(peloton.tropas).not.toContain(tropa);
        expect(peloton.tropas.length).toBe(1);
        expect(peloton.tropas[0].tipo).toBe(LEVA);
        expect(peloton.tropas[0].cantidad).toBe(2);
        expect(peloton.tropas[0].movido).toBe(0);
    });

    it('Agregar una tropa que ya existe debe aumentar la cantidad de tropas de ese tipo y si la nueva tropa ha movido más debe ser ese el valor de movido', () =>{
        
        peloton.agregarTropa(tropa);
        tropa.movido = 1;
        peloton.agregarTropa(tropa);

        expect(peloton.tropas).not.toContain(tropa);
        expect(peloton.tropas.length).toBe(1);
        expect(peloton.tropas[0].tipo).toBe(LEVA);
        expect(peloton.tropas[0].cantidad).toBe(2);
        expect(peloton.tropas[0].movido).toBe(1);
    });

    it('Agregar dos tropas de distintos tipos tiene que aumentar el tamaño de tropas en dos y contener ambos tipos', () =>{
        
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(soldado);

        expect(peloton.tropas[0]).not.toBe(tropa);
        expect(peloton.tropas[1]).not.toBe(soldado);
        expect(peloton.tropas.length).toBe(2);
        expect(peloton.tropas[0].tipo).toBe(LEVA);
        expect(peloton.tropas[0].cantidad).toBe(1);
        expect(peloton.tropas[1].tipo).toBe(SOLDADO);
        expect(peloton.tropas[1].cantidad).toBe(1);
    });
});

describe('quitarTropa', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        soldado = new Tropa(SOLDADO, 1, 0);        
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(tropa);

    });

    it('Quitar una tropa cuando hay más de una debe reducir su cantidad en uno', () =>{
        
        peloton.quitarTropa(tropa);

        expect(peloton.tropas.length).toBe(1);
        expect(peloton.tropas[0].tipo).toBe(LEVA);
        expect(peloton.tropas[0].cantidad).toBe(1);
    });

    it('Quitar todas las tropas de un tipo tiene que dejar el array de tropas vacio', () =>{
        
        tropa.cantidad = 2;
        peloton.quitarTropa(tropa);

        expect(peloton.tropas).not.toContain(tropa);
        expect(peloton.tropas.length).toBe(0);        
    });

    it('Quitar una tropa cuando hay varios tipos debe dejar el resto de tipos igual', () =>{
        
        peloton.agregarTropa(soldado);
        tropa.cantidad = 2;
        peloton.quitarTropa(tropa);

        expect(peloton.tropas).not.toContain(tropa);
        expect(peloton.tropas.length).toBe(1);
        expect(peloton.tropas[0].tipo).toBe(SOLDADO);
        expect(peloton.tropas[0].cantidad).toBe(1);
    });
});

describe('puedeMover', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        soldado = new Tropa(SOLDADO, 1, 0);
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(soldado);

    });

    it('Si todas las tropas tienen el contador de movido por debajo de su movimiento pueden mover debe devolver verdadero', () =>{
        var resultado = peloton.puedeMover();

        expect(resultado).toBe(true);
        
    });

    it('Si alguna de las tropas del peloton no tiene el contador de movido por debajo de su movimiento debe devolver falso', () =>{
        peloton.tropas[0].movido = 2;
        var resultado = peloton.puedeMover();
        

        expect(resultado).toBe(false);
    
    });

});

describe('estaIniciandoMovimiento', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        soldado = new Tropa(SOLDADO, 1, 0);
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(soldado);

    });

    it('Si el valor del contador movido es 0 quiere decir que está iniciando el movimiento y tiene que devolver true', () =>{
        var resultado = peloton.estaIniciandoMovimiento();

        expect(resultado).toBeTruthy();
        
    });

    it('Si alguna de las tropas del peloton no tiene el contador de movido a 0 quiere decir que ya ha movido este turno y debe devolver false', () =>{
        peloton.tropas[0].movido = 1;
        var resultado = peloton.estaIniciandoMovimiento();
        

        expect(resultado).not.toBeTruthy();
    
    });

});

describe('mover', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        soldado = new Tropa(SOLDADO, 1, 0);
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(soldado);

    });

    it('El jugador debe incrementar el número de pelotones moviendo y las tropas su valor movido en uno', () =>{
        peloton.mover();

        expect(peloton.jugador.pelotonesMoviendo).toBe(1);
        expect(peloton.tropas[0].movido).toBe(1);
        expect(peloton.tropas[1].movido).toBe(1);
        
    });

    it('Si mueve dos veces el jugador debe tener los pelotones moviendo a 1 y las tropas su valor de movido a 2', () =>{
        peloton.mover();
        peloton.mover();
        
        expect(peloton.jugador.pelotonesMoviendo).toBe(1);
        expect(peloton.tropas[0].movido).toBe(2);
        expect(peloton.tropas[1].movido).toBe(2);
    
    });

});

describe('paralizar', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        soldado = new Tropa(SOLDADO, 1, 0);
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(soldado);

    });

    it('El contador de movido de todas las tropas debe ser igual a su movimiento', () =>{
        peloton.paralizar();

        expect(peloton.tropas[0].movido).toBe(peloton.tropas[0].movimiento);
        expect(peloton.tropas[1].movido).toBe(peloton.tropas[1].movimiento);
        
    });

});

describe('iniciar turno', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 1);
        soldado = new Tropa(SOLDADO, 1, 2);
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(soldado);

    });

    it('El contador de movido de todas las tropas debe ponerse a cero', () =>{        
        peloton.iniciarTurno();

        expect(peloton.tropas[0].movido).toBe(0);
        expect(peloton.tropas[1].movido).toBe(0);
        
    });

});

describe('obtener velocidad máxima', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let caballero: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        caballero = new Tropa(CABALLERO, 1, 0);
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(caballero);

    });

    it('Debe devolver la velocidad más alta entre todas las tropas, el 2 del caballero', () =>{        
        var resultado = peloton.obtenerVelocidadMaxima();

        expect(resultado).toBe(caballero.velocidad);
        
    });

});

describe('obtener heridas provocadas', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;
    let arquero: Tropa;
    let caballero: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        soldado = new Tropa(SOLDADO, 1, 0);
        arquero = new Tropa(ARQUERO, 1, 0);
        caballero = new Tropa(CABALLERO, 1, 0);
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(soldado);
        peloton.agregarTropa(arquero);
        peloton.agregarTropa(caballero);

    });

    it('Debe devolver la suma de todas las tropas que causan daño con velocidad 1, todos menos el caballero', () =>{        
        var resultado = peloton.obtenerHeridasProvocadas(1);

        expect(resultado).toBe(4);
        
    });

    it('Debe devolver la suma de todas las tropas que causan daño con velocidad 2, el caballero', () =>{        
        var resultado = peloton.obtenerHeridasProvocadas(2);

        expect(resultado).toBe(2);
        
    });

});

describe('repartir heridas sufridas', () => {
    let peloton: Peloton;
    let tropa: Tropa;
    let soldado: Tropa;
    let arquero: Tropa;
    let caballero: Tropa;

    beforeEach(() => {
        var jugador = new Jugador('Paco', '#000000', 0, false);
        peloton = new Peloton(jugador);
        tropa = new Tropa(LEVA, 1, 0);
        soldado = new Tropa(SOLDADO, 1, 0);
        arquero = new Tropa(ARQUERO, 1, 0);
        caballero = new Tropa(CABALLERO, 1, 0);
        peloton.agregarTropa(tropa);
        peloton.agregarTropa(soldado);
        peloton.agregarTropa(arquero);
        peloton.agregarTropa(caballero);

    });

    it('Si sufre una herida debe morir la Leva', () =>{        
        peloton.repartirHeridasSufridas(1);

        expect(peloton.tropas.length).toBe(3);
        expect(peloton.tropas).not.toContain(tropa);
        
    });

    it('Si sufre dos heridas deben morir la leva y el arquero', () =>{        
        peloton.repartirHeridasSufridas(2);

        expect(peloton.tropas.length).toBe(2);
        expect(peloton.tropas).not.toContain(tropa);
        expect(peloton.tropas).not.toContain(arquero);
        
    });

    it('Si sufre tres heridas solo deben morir la leva y el arquero', () =>{        
        peloton.repartirHeridasSufridas(3);

        expect(peloton.tropas.length).toBe(2);
        expect(peloton.tropas).not.toContain(tropa);
        expect(peloton.tropas).not.toContain(arquero);
    });

    it('Si sufre cuatro heridas deben morir la leva, el arquero y el soldado', () =>{        
        peloton.repartirHeridasSufridas(4);

        expect(peloton.tropas.length).toBe(1);
        expect(peloton.tropas).toContain(caballero);
    });
    it('Si sufre 5 heridas deben morir la leva, el arquero y el soldado', () =>{        
        peloton.repartirHeridasSufridas(5);

        expect(peloton.tropas.length).toBe(1);
        expect(peloton.tropas[0].tipo).toBe(caballero.tipo);
    });
    it('Si sufre 7 heridas deben morir todos, la leva, el arquero, el soldado y el caballero', () =>{        
        peloton.repartirHeridasSufridas(7);

        expect(peloton.tropas.length).toBe(0);
    });

});