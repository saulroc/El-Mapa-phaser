import * as Phaser from 'phaser';
import { Carta } from '../Model/carta';
import { Ficha } from '../Model/ficha';

var fichas = [{
    frame: 0,
    nombre: "pueblo ini",
    nivel: 0,
    colocada: false,
    oculta: false
    },
    {
    frame: 8,
    nombre: "mina madera ini",
    nivel: 0,
    colocada: false,
    oculta: false
    },
    {
    frame: 16,
    nombre: "mina piedra ini",
    nivel: 0,
    colocada: false,
    oculta: false
    }
];

export class Jugador extends Phaser.Physics.Arcade.Sprite {
    nombre: string;
    nombreText: Phaser.GameObjects.Text;
    CPU: boolean;
    color:  Phaser.Display.Color;
    mano: Carta[];
    fichasTerreno: Phaser.Physics.Arcade.Group;
    activo: boolean;
    madera: number;
    oro: number;
    piedra: number;
    puntos: number;
    numero: number;

    public constructor (scene: Phaser.Scene, color: Phaser.Display.Color, nombre: string, numero: number){
        super(scene, 0, 0, 'jugador',0);
        this.color = color;
        this.scene = scene;
        this.nombre = nombre;
        this.numero = numero;
        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.immovable = true;
        this.activo = false;
        this.setScale(this.scene.game.scale.width / this.width / 8 , this.scene.game.scale.height / this.height / 8);

        this.setTint(color.color);
        this.setX(this.getBounds().width * (numero + 0.5));

        this.nombreText = this.scene.add.text(this.x, this.y, this.nombre);
        this.nombreText.setOrigin(0.5, 0);
        this.nombreText.setScrollFactor(0);
    }

    inicializarFichas() {
        this.fichasTerreno = this.scene.physics.add.group();
        for( var i = 0; i < fichas.length; i++) {
            var ficha = fichas[i];
            var fichaTerreno = new Ficha(this.scene, ficha.frame,ficha.nombre, ficha.nivel, ficha.colocada, ficha.oculta);
            fichaTerreno.setVisible(false);
            fichaTerreno.setPosition(50 * i * this.numero + fichaTerreno.width, 50 * i * this.numero + fichaTerreno.height);
            this.fichasTerreno.add(fichaTerreno);
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

    activar() {
        this.activo = true;
        this.setFrame(1);
    }

    desactivar() {
        this.activo = false;
        this.setFrame(0);
    }

}