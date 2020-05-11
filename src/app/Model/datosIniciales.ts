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
    tropa: [{ jugador: null, 
        tropas: [{ tipo: "leva",
            cantidad: 1,
            vida: 1,
            ataque: 1,
            movimiento: 2,
            movido: 0,
            velocidad: 1,
            distanciaDeAtaque: 0
    }] }]
}/*,
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
    tropa: []
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
    tropa: []
},
{
    frame: 9,
    nombre: "ficha 3",
    nivel: 1,
    colocada: false,
    oculta: true,
    pueblo: false,
    minaMadera: false,
    minaPiedra: false,
    minaOro: false,
    tropa: []
}*/
];

export const INI_EDIFICIOS = [{
    nombre: 'ayuntamiento',
    posicion: -1,
    nivel: 1,
    oro: 2,
    madera: 0,
    piedra: 0,
    frame: 0
},
{
    nombre: 'almacen',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 1,
    piedra: 0,
    frame: 1
},
{
    nombre: 'cuartel',
    posicion: -1,
    nivel: 1,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 2
},
{
    nombre: 'estatua',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 0,
    piedra: 0,
    frame: 3
},
{
    nombre: 'biblioteca',
    posicion: -1,
    nivel: 1,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 4
},
{
    nombre: 'mercado',
    posicion: -1,
    nivel: 1,
    oro: 1,
    madera: 0,
    piedra: 0,
    frame: 5
},
{
    nombre: 'arqueria',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 2,
    piedra: 0,
    frame: 6
},
{
    nombre: 'atalaya',
    posicion: -1,
    nivel: 2,
    oro: 4,
    madera: 1,
    piedra: 0,
    frame: 7
},
{
    nombre: 'banco',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 8
},
{
    nombre: 'laboratorio',
    posicion: -1,
    nivel: 2,
    oro: 5,
    madera: 2,
    piedra: 0,
    frame: 9
},
{
    nombre: 'tesoreria',
    posicion: -1,
    nivel: 3,
    oro: 4,
    madera: 2,
    piedra: 1,
    frame: 10
},
{
    nombre: 'establos',
    posicion: -1,
    nivel: 3,
    oro: 5,
    madera: 2,
    piedra: 1,
    frame: 11
},
{
    nombre: 'coliseo',
    posicion: -1,
    nivel: 3,
    oro: 5,
    madera: 2,
    piedra: 1,
    frame: 12
},
{
    nombre: 'universidad',
    posicion: -1,
    nivel: 3,
    oro: 7,
    madera: 2,
    piedra: 1,
    frame: 13
},
{
    nombre: 'teatro',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 1,
    piedra: 0,
    frame: 14
},
{
    nombre: 'armeria',
    posicion: -1,
    nivel: 2,
    oro: 3,
    madera: 0,
    piedra: 1,
    frame: 15
}];