import { Partida } from './partida';

const colores = ["0xff0000", "0x0000ff", "0x008000", "0xffff00", "0xD2B48C", "0xff4500", "0x800080", "0x00ffff"]; 

describe('iniciarJugadores', () => {
    let partida: Partida;
    let ini_jugadores: { nombre: string, cpu: boolean, color: string }[];

    beforeEach(() => {
        partida = new Partida();

    });

    it('iniciar jugadores con un conjunto vacio', () =>{
                
        ini_jugadores = [];

        partida.iniciarJugadores(ini_jugadores);

        expect(partida.jugadorActivo).toBe(undefined);
        expect(partida.jugadores.length).toBe(0);
        
    });

    it('iniciar jugadores con un jugador', () =>{
        
        ini_jugadores = [];
        ini_jugadores.push({ nombre : "Paco", cpu: false, color:"red"});

        partida.iniciarJugadores(ini_jugadores);

        expect(partida.jugadorActivo).not.toBe(undefined);
        expect(partida.jugadores.length).toBe(1);
    });
});
