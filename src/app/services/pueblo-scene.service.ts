import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { Jugador } from '../Model/jugador';
import { Edificio } from '../Model/edificio';
import { Pueblo } from '../Model/pueblo';
import { Ficha } from '../Model/ficha';

const COLOR_ZONA_CONSTRUCCION = 0x00ff00;
const COLOR_ZONA_CONSTRUCCION_SELECCIONADA = 0x0000ff;
const COLOR_EDIFICIO_INACTIVO = 0xA4A4A4;

@Injectable({
  providedIn: 'root'
})
export class PuebloSceneService extends Phaser.Scene {
    
    background: Phaser.GameObjects.Image;
    pueblo: Pueblo;
    fichaPueblo: Ficha;
    edificios: Phaser.GameObjects.Group;
    posicionSeleccionada: number = -1;
    zonasDeConstruccion: Phaser.GameObjects.Group;
    jugador: Jugador;
    

    public constructor() {
        super({ key: 'Pueblo' });
    }

    public init(ficha: Ficha) {
        this.pueblo = ficha.pueblo;
        this.fichaPueblo = ficha;
    }

    public preload() {
        this.load.spritesheet('edificios', 'assets/edificios.png', { frameWidth: 413, frameHeight: 413 });
        this.load.image('fondo', 'assets/Tablero Castillo 3.png');

    }

    public create() {
        this.background = this.add.image(0, 0, 'fondo');
        this.background.setOrigin(0, 0);

        var scale = this.fichaPueblo.getEscala();

        this.jugador = this.game.scene.getScene('Map').jugadorActivo;

        //var escalaX = this.cameras.main.width / this.background.width;
        //var escalaY = this.cameras.main.height / this.background.height;
        this.background.setScale(scale);
        
        this.edificios = this.add.group();
        this.zonasDeConstruccion = this.add.group();;

        var estilo = { 
            font: 'bold 16pt Arial',
            fill: '#000000',
            align: 'center',
            wordWrap: true
           }
        var textoVolver = this.add.text(this.cameras.main.width / 8 * 7, this.cameras.main.height / 12, 'Cerrar', estilo);
        textoVolver.setInteractive();
        textoVolver.on('pointerup', this.cerrar, this);

        if(this.pueblo && this.pueblo.edificios)
            this.cargarEdificios(this.pueblo.edificios);

        if (this.pueblo.color == this.jugador.color && !this.pueblo.construido)
            this.cargarZonasConstruccion();
    }    

    cargarZonasConstruccion() {
        
        var ancho = this.fichaPueblo.width * this.fichaPueblo.getEscala();
        
        for(var i = 0; i < 10; i++) {
            var zonaConstruccion = this.add.rectangle(10 , 10, ancho, ancho, COLOR_ZONA_CONSTRUCCION, 1);
            this.posicionar(zonaConstruccion, i, -1); 
            if(i < 4)
                zonaConstruccion.setInteractive();
            zonaConstruccion.setStrokeStyle(4, 0xefc53f);
            zonaConstruccion.on('pointerup', this.seleccionarParaConstruir);

            this.zonasDeConstruccion.add(zonaConstruccion);
        }
    }

    seleccionarParaConstruir() {
        this.scene.seleccionadoParaConstruir(this);
    }

    seleccionadoParaConstruir(zonaConstruccion) {
        
        if (this.pueblo.construido) return;
        
        var indice = this.zonasDeConstruccion.getChildren().indexOf(zonaConstruccion);
        this.posicionSeleccionada = indice;

        this.zonasDeConstruccion.getChildren().forEach(zona => {
            zona.setFillStyle(COLOR_ZONA_CONSTRUCCION, 1);            
        });

        this.zonasDeConstruccion.getChildren()[indice].setFillStyle(COLOR_ZONA_CONSTRUCCION_SELECCIONADA, 1);

        this.edificios.getChildren().forEach(edificio => {
            if (edificio.posicion == -1 )
            {
                if (edificio.sePuedeConstruir(this.jugador.oro, this.jugador.madera, this.jugador.piedra, indice)) {
                    edificio.clearTint();
                    edificio.setInteractive();
                    edificio.once('pointerup', this.construyendoEdificio);

                } else {
                    edificio.tint = COLOR_EDIFICIO_INACTIVO;
                }
            }
        });
    }

    cargarEdificios(edificios){
        for (var i = 0; i < edificios.length; i ++) {
            var edificio = new Edificio(this,
                edificios[i].frame, 
                edificios[i].nombre, 
                edificios[i].nivel,
                edificios[i].posicion, 
                edificios[i].oro, 
                edificios[i].madera,
                edificios[i].piedra );
            
            this.posicionar(edificio, edificio.posicion, edificio.numeroFrame);
            this.edificios.add(edificio);
        }
    }

    construyendoEdificio() {
        this.scene.construirEdificio(this);
    }

    construirEdificio(edificio) {
        edificio.posicion = this.posicionSeleccionada;
        this.posicionar(edificio, edificio.posicion, edificio.numeroFrame);        
        edificio.setDepth(1);
        this.zonasDeConstruccion.setVisible(false);

        this.edificios.getChildren().forEach(edificio => edificio.clearTint() );

        this.pueblo.construirEdificio(this.posicionSeleccionada, edificio.nombre);
        this.jugador.setOro(this.jugador.oro - edificio.oro);
        this.jugador.setMadera(this.jugador.madera - edificio.madera);
        this.jugador.setPiedra(this.jugador.piedra - edificio.piedra);
    }

    posicionar(objeto: any, posicion: number, frame:number) {
        var x: number, y: number;

        switch (posicion) {
            case -1:
                x = this.scale.width - objeto.width * objeto.scaleX * (Math.floor(frame / 5)+1);
                y = frame % 5  * objeto.height * objeto.scaleY + (objeto.height * objeto.scaleY) / 2;
                break;
            case 0:
            case 1:
            case 2:
            case 3:
                x = (posicion + 0.5) * objeto.width * objeto.scaleX;
                y = objeto.height * objeto.scaleY * 3 + (objeto.height * objeto.scaleY) / 2;
                break;

            case 4:
            case 5:
            case 6:
                x = (posicion - 3.5) * objeto.width * objeto.scaleX + objeto.width / 2;
                y = objeto.height * objeto.scaleY * 2 + (objeto.height * objeto.scaleY) / 2;
                break;
            case 7:
            case 8:
                x = (posicion - 5.5) * objeto.width * objeto.scaleX;
                y = objeto.height * objeto.scaleY * 1 + (objeto.height * objeto.scaleY) / 2;
                break;
            case 9:
                x = (posicion - 7.5) * objeto.width * objeto.scaleX + objeto.width / 2;
                y = (objeto.height * objeto.scaleY) / 2;
                break;
            default:
                x = this.scale.width - objeto.width * objeto.scaleX;
                y = frame * objeto.height * objeto.scaleY;
                break;
        }

        objeto.setPosition(x, y);
    }

    pintarLevas() {
        var x = 50;
        var y = 50;
        for(var i = 0; i < this.pueblo.leva; i++) {
            var leva = this.add.sprite(x, y, 'marcadores', 2);
            leva.setInteractive();
            x += 5;
            y += 5;
        }
    }

    cerrar() {
        this.scene.resume('Map');
        this.scene.stop();
    }

    public update() {

    }
}