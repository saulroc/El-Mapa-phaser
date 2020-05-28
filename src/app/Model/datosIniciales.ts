export const ini_jugadores = [{
    nombre: 'Jugador 1',
    cpu: false,
    color: "0xff0000"
  },
  {
    nombre: 'Jugador 2',
    cpu: false,
    color: "0x0000ff"
  }/*,
  {
    nombre: 'CPU 1',
    cpu: true,
    color: "0x008000"
  }*/];
export const INI_FICHAS = [{
    frame: 0,
    nombre: "pueblo ini",
    nivel: 0,
    colocada: false,
    oculta: false,
    pueblo: true,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 8,
    nombre: "mina madera ini",
    nivel: 0,
    colocada: false,
    oculta: false,
    pueblo: false,
    minaMadera: true,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 16,
    nombre: "mina piedra ini",
    nivel: 0,
    colocada: false,
    oculta: false,
    pueblo: false,
    minaMadera: false,
    minaPiedra: true,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 24,
    nombre: "ficha 1",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 32,
    nombre: "ficha 2",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 1,
    tropa: []
},
{
    frame: 1,
    nombre: "ficha 3",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 1,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 9,
    nombre: "ficha 4",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 17,
    nombre: "ficha 5",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 25,
    nombre: "ficha 6",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 33,
    nombre: "ficha 7",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 2,
    nombre: "ficha 8",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 10,
    nombre: "ficha 9",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 1,
    tesoro: 0,
    tropa: []
},
{
    frame: 18,
    nombre: "ficha 10",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 1,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 26,
    nombre: "ficha 11",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 1,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "soldado",
            cantidad: 1,
            vida: 2,
            ataque: 2,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 2,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 34,
    nombre: "ficha 12",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 2,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 2,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 3,
    nombre: "ficha 13",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 11,
    nombre: "ficha 14",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 19,
    nombre: "ficha 15",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 27,
    nombre: "ficha 16",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 35,
    nombre: "ficha 17",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 4,
    nombre: "ficha 18",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 12,
    nombre: "ficha 19",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: true,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 20,
    nombre: "ficha 20",
    nivel: 2,
    colocada: false,
    oculta: true,
    pueblo: true,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 2,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 28,
    nombre: "ficha 21",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [],
    bloqueoEste: true
},
{
    frame: 36,
    nombre: "ficha 22",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [],
    bloqueoOeste: true
},
{
    frame: 5,
    nombre: "ficha 23",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 3,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "caballero",
            cantidad: 1,
            vida: 3,
            ataque: 2,
            movimiento: 3,
            movido: 0,
            velocidad: 2,
            nivel: 4,
            distanciaDeAtaque: 0
    }] }]
},
{
    frame: 13,
    nombre: "ficha 24",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 2,
    tropa: [{ jugador: null, 
        tropas: [{ 
            tipo: "caballero",
            cantidad: 1,
            vida: 3,
            ataque: 2,
            movimiento: 3,
            movido: 0,
            velocidad: 2,
            nivel: 4,
            distanciaDeAtaque: 0
        },
        { 
            tipo: "soldado",
            cantidad: 1,
            vida: 2,
            ataque: 2,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 2,
            distanciaDeAtaque: 0
        }] }]
},
{
    frame: 21,
    nombre: "ficha 25",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [],
    bloqueoEste: true
},
{
    frame: 29,
    nombre: "ficha 26",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ 
            tipo: "leva",
            cantidad: 2,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
        }] }],
    bloqueoOeste: true
},
{
    frame: 37,
    nombre: "ficha 27",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [],
    bloqueoEste: true,
    bloqueoOeste: true
},
{
    frame: 6,
    nombre: "ficha 28",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 2,
    tropa: [{ jugador: null, 
        tropas: [{ 
            tipo: "arquero",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 3,
            distanciaDeAtaque: 1
        },
        { 
            tipo: "soldado",
            cantidad: 1,
            vida: 2,
            ataque: 2,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 2,
            distanciaDeAtaque: 0
        }] }]
},
{
    frame: 14,
    nombre: "ficha 29",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [],
    bloqueoEste: true
},
{
    frame: 22,
    nombre: "ficha 30",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [],
    bloqueoSur: true
},
{
    frame: 30,
    nombre: "ficha 31",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: []
},
{
    frame: 38,
    nombre: "ficha 32",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 2,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ 
            tipo: "soldado",
            cantidad: 1,
            vida: 2,
            ataque: 2,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 2,
            distanciaDeAtaque: 0
        }] }]
},
{
    frame: 7,
    nombre: "ficha 33",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [],
    bloqueoOeste: true
},
{
    frame: 15,
    nombre: "ficha 34",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: true,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ 
            tipo: "soldado",
            cantidad: 1,
            vida: 2,
            ataque: 2,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 2,
            distanciaDeAtaque: 0
        }] }],
    bloqueoNorte: true
},
{
    frame: 23,
    nombre: "ficha 35",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: true,
    minaTecnologia: 0,
    tesoro: 1,
    tropa: [{ jugador: null, 
        tropas: [{ 
            tipo: "soldado",
            cantidad: 1,
            vida: 2,
            ataque: 2,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 2,
            distanciaDeAtaque: 0
        },
        { 
            tipo: "arquero",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 3,
            distanciaDeAtaque: 1
        }] }],
    bloqueoNorte: true,
    bloqueoEste: true
},
{
    frame: 31,
    nombre: "ficha 36",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: true,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [{ jugador: null, 
        tropas: [{ 
            tipo: "leva",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 1,
            distanciaDeAtaque: 0
        },
        { 
            tipo: "arquero",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            nivel: 3,
            distanciaDeAtaque: 1
        }] }],
    bloqueoNorte: true,
    bloqueoEste: true
},
{
    frame: 39,
    nombre: "ficha 37",
    nivel: 3,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    minaTecnologia: 0,
    tesoro: 0,
    tropa: [],
    bloqueoNorte: false,
    bloqueoEste: false,
    bloqueoOeste: false,
    bloqueoSur: false
}
];

export const INI_EDIFICIOS = [{
    nombre: 'ayuntamiento',
    posicion: -1,
    nivel: 1,
    oro: 2,
    madera: 0,
    piedra: 0,
    puntos: 1,
    generaOro: 1,
    numeroFrame: 0,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'Incrementa la ganancia de oro en uno.'
},
{
    nombre: 'almacen',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 1,
    piedra: 0,
    puntos: 1,
    generaOro: 0,
    numeroFrame: 1,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'Incrementa las tropas que se pueden mover en el mapa en uno.'
},
{
    nombre: 'cuartel',
    posicion: -1,
    nivel: 1,
    oro: 3,
    madera: 1,
    piedra: 0,
    puntos: 1,
    generaOro: 0,
    numeroFrame: 2,
    tropa: {
        tipo: 'soldado',
        cantidad: 1,
        ataque: 2,
        vida: 2,
        movimiento: 2,
        velocidad: 1,
        movido: 0,
        distanciaDeAtaque: 0,
        nivel: 2,
        coste: {oro: 2, madera: 0, piedra: 0}
    },
    incrementoTropa: 0.5,
    descripcion: 'Permite reclutar soldados.'
},
{
    nombre: 'estatua',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 0,
    piedra: 0,
    puntos: 4,
    generaOro: 0,
    numeroFrame: 3,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'Suma tres puntos más.'
},
{
    nombre: 'biblioteca',
    posicion: -1,
    nivel: 1,
    oro: 3,
    madera: 1,
    piedra: 0,
    puntos: 1,
    generaOro: 0,
    numeroFrame: 4,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'NO IMPLEMENTADO - Genera una carta de tecnología de nivel 1 por turno.'
},
{
    nombre: 'mercado',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 0,
    piedra: 0,
    puntos: 1,
    generaOro: 0,
    numeroFrame: 5,
    tropa: null,
    incrementoTropa: 0,
    incrementaComercio: 1,
    descripcion: 'Incrementa los trueques que se pueden realizar en uno.'
},
{
    nombre: 'arqueria',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 2,
    piedra: 0,
    puntos: 2,
    generaOro: 0,
    numeroFrame: 6,
    tropa: {
        tipo: 'arquero',
        cantidad: 1,
        ataque: 1,
        vida: 1,
        movimiento: 2,
        velocidad: 1,
        movido: 0,
        distanciaDeAtaque: 1,
        nivel: 3,
        coste: {oro: 2, madera: 0, piedra: 0}
    },
    incrementoTropa: 1,
    descripcion: 'Permite reclutar arqueros.'
},
{
    nombre: 'atalaya',
    posicion: -1,
    nivel: 2,
    oro: 4,
    madera: 1,
    piedra: 0,
    puntos: 2,
    generaOro: 0,
    numeroFrame: 7,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'NO IMPLEMENTADO - Permite voltear una ficha del mapa por turno.'
},
{
    nombre: 'banco',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 1,
    piedra: 0,
    puntos: 2,
    generaOro: 1,
    numeroFrame: 8,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'Incrementa la ganancia de oro en uno.'
},
{
    nombre: 'laboratorio',
    posicion: -1,
    nivel: 2,
    oro: 5,
    madera: 2,
    piedra: 0,
    puntos: 2,
    generaOro: 0,
    numeroFrame: 9,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'NO IMPLEMENTADO - Genera una carta de tecnología de nivel 2 por turno.'
},
{
    nombre: 'tesoreria',
    posicion: -1,
    nivel: 3,
    oro: 4,
    madera: 2,
    piedra: 1,
    puntos: 3,
    generaOro: 2,
    numeroFrame: 10,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'Incrementa la ganancia de oro en dos.'
},
{
    nombre: 'establos',
    posicion: -1,
    nivel: 3,
    oro: 5,
    madera: 2,
    piedra: 1,
    puntos: 3,
    generaOro: 0,
    numeroFrame: 11,
    tropa: {
        tipo: 'caballero',
        cantidad: 1,
        ataque: 2,
        vida: 3,
        movimiento: 3,
        velocidad: 2,
        movido: 0,
        distanciaDeAtaque: 0,
        nivel: 4,
        coste: {oro: 2, madera: 1, piedra: 0}
    },
    incrementoTropa: 0.333,
    descripcion: 'Permite reclutar caballeros.'
},
{
    nombre: 'coliseo',
    posicion: -1,
    nivel: 3,
    oro: 5,
    madera: 2,
    piedra: 1,
    puntos: 10,
    generaOro: 0,
    numeroFrame: 12,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'Suma 7 puntos más.'
},
{
    nombre: 'universidad',
    posicion: -1,
    nivel: 3,
    oro: 7,
    madera: 2,
    piedra: 1,
    puntos: 3,
    generaOro: 0,
    numeroFrame: 13,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'NO IMPLEMENTADO - Genera una carta de tecnología de nivel 3 por turno.'
},
{
    nombre: 'teatro',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 1,
    piedra: 0,
    puntos: 7,
    generaOro: 0,
    numeroFrame: 14,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'Suma 5 puntos más.'
},
{
    nombre: 'armeria',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 0,
    piedra: 1,
    puntos: 2,
    generaOro: 0,
    numeroFrame: 15,
    tropa: null,
    incrementoTropa: 0,
    descripcion: 'NO IMPLEMENTADO - Dobla las tropas disponibles para reclutar.'
}];