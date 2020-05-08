import * as Phaser from 'phaser';
import { Carta } from '../Model/carta';
import { Ficha } from '../Model/ficha';
import { Pueblo } from '../Model/pueblo';

var fichas = [{
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
    }/*,
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
        tropa: [{ leva: 1 }]
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

export class Jugador extends Phaser.Physics.Arcade.Sprite {
    nombre: string;
    nombreText: Phaser.GameObjects.Text;
    oroText: Phaser.GameObjects.Text;
    maderaText: Phaser.GameObjects.Text;
    piedraText: Phaser.GameObjects.Text;
    CPU: boolean;
    color:  Phaser.Display.Color;
    mano: Carta[];
    pueblos: Pueblo[] = [];
    fichasTerreno: Phaser.Physics.Arcade.Group;
    activo: boolean;
    madera: number;
    oro: number;
    piedra: number;
    puntos: number;
    numero: number;

    public constructor (scene: Phaser.Scene, color: Phaser.Display.Color, nombre: string, numero: number, cpu: boolean){
        super(scene, 0, 0, 'jugador',0);
        this.color = color;
        this.scene = scene;
        this.nombre = nombre;
        this.numero = numero;
        this.CPU = cpu;
        if (this.CPU)
            this.setFrame(2);

        this.oro = 3;
        this.piedra = 0;
        this.madera = 0;
        this.puntos = 0;

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.immovable = true;
        this.activo = false;
        this.setScale(this.scene.game.scale.width / this.width / 8 , this.scene.game.scale.height / this.height / 8);

        this.setTint(color.color);
        this.setX(this.getBounds().width * (numero + 0.5));
        
        var estilo = { 
            font: 'bold 10pt Arial',
            fill: '#000000',
            align: 'center'
           }

        this.nombreText = this.scene.add.text(this.x, this.y, this.nombre, estilo);
        this.nombreText.setOrigin(0.5, 0);
        this.nombreText.setScrollFactor(0);

        this.oroText = this.scene.add.text(this.x, this.nombreText.y + this.nombreText.height, "Oro: " + this.oro, estilo);
        this.oroText.setOrigin(0.5, 0);
        this.oroText.setScrollFactor(0);
        
        this.maderaText = this.scene.add.text(this.x, this.oroText.y + this.oroText.height, "Piedra: " + this.piedra, estilo);
        this.maderaText.setOrigin(0.5, 0);
        this.maderaText.setScrollFactor(0);

        this.piedraText = this.scene.add.text(this.x, this.maderaText.y + this.maderaText.height, "Madera: " + this.madera, estilo);
        this.piedraText.setOrigin(0.5, 0);
        this.piedraText.setScrollFactor(0);
    }

    posicionarDelante() {
        this.setDepth(3);
        this.oroText.setDepth(4) ;    
        this.maderaText.setDepth(4) ;    
        this.piedraText.setDepth(4) ;    
    }

    inicializarFichas() {
        this.fichasTerreno = this.scene.physics.add.group();
        for( var i = 0; i < fichas.length; i++) {
            var ficha = fichas[i];
            var fichaTerreno = new Ficha(
                this.scene, 
                ficha.frame,
                ficha.nombre, 
                ficha.nivel, 
                ficha.colocada, 
                ficha.oculta,
                ficha.pueblo ? 
                    (i == 0) ? 
                        new Pueblo(this.color) 
                        : new Pueblo(new Phaser.Display.Color(255, 255, 255, 255)) 
                    : null,
                ficha.minaMadera,
                ficha.minaPiedra
                );

            if(fichaTerreno.pueblo)
                fichaTerreno.pueblo.nombre = ficha.nombre;

            fichaTerreno.setVisible(false);            
            fichaTerreno.setPosition(50 * i * this.numero + fichaTerreno.width, 50 * i * this.numero + fichaTerreno.height);
            this.fichasTerreno.add(fichaTerreno);
            if (i == 0 && fichaTerreno.pueblo) {                
                this.pueblos.push(fichaTerreno.pueblo);
            }
        }
        
    }

    getSiguienteFicha() {
        if (!this.fichasTerreno) return null;
        var fichasArray = this.fichasTerreno.getChildren();

        for (var i = (fichasArray.length-1); i >= 0; i--) 
        {
            var ficha = <Ficha>fichasArray[i];
            if (!ficha.colocada)
                return ficha;
        }

        return null;
    }

    getZonaColocacion() {
        
    }

    iniciarTurno() {
        this.pueblos.forEach(pueblo => { pueblo.iniciarTurno(); })
    }

    activar() {
        this.activo = true;
        if (this.CPU)
            this.setFrame(3);
        else
            this.setFrame(1);
        this.setActive(true);
    }

    desactivar() {
        this.activo = false;
        if (this.CPU)
            this.setFrame(2);
        else
            this.setFrame(0);
        this.setActive(false);
    }

    public setOro(nuevoOro: number) {
        this.oro = nuevoOro;
        this.oroText.text = "Oro: " + this.oro;
    }

    public setMadera(nuevoMadera: number) {
        this.madera = nuevoMadera;
        this.maderaText.text = "Madera: " + this.madera;
    }

    public setPiedra(nuevoPiedra: number) {
        this.piedra = nuevoPiedra;
        this.piedraText.text = "Piedra: " + this.piedra;
    }

}