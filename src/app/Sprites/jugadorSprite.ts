import * as Phaser from 'phaser';
import { CartaSprite } from './cartaSprite';
import { FichaSprite } from './fichaSprite';
import { Pueblo } from '../Model/pueblo';
import { INI_FICHAS } from '../Model/datosIniciales';
import { Peloton } from '../Model/peloton';
import { Jugador } from '../Model/jugador';
import { Ficha } from '../Model/ficha';

export const COLOR_TEXTO = '#FFFFFF';
export const COLOR_STROKE = '#000000';
export const COLOR_MADERA = '#b9340d';
export const COLOR_ORO = '#daa520';
export const COLOR_PIEDRA = '#696969';
export const COLOR_PUNTOS = '#008000';
const COLOR_ACTIVO = 0x000000;

export class JugadorSprite extends Phaser.Physics.Arcade.Sprite {
    nombreText: Phaser.GameObjects.Text;
    oroText: Phaser.GameObjects.Text;
    maderaText: Phaser.GameObjects.Text;
    piedraText: Phaser.GameObjects.Text;
    puntosText: Phaser.GameObjects.Text;
    textos: Phaser.GameObjects.Group;
    color:  Phaser.Display.Color;
    mano: CartaSprite[];
    fichasTerreno: Phaser.Physics.Arcade.Group;
    

    mensajesInformacion: {color: string, mensaje: string}[];
    tweenActivo: Phaser.Tweens.Tween;
    jugador: Jugador;
    oroAnterior: number;
    maderaAnterior: number;
    piedraAnterior: number;
    puntosAnterior: number;

    public constructor (scene: Phaser.Scene, jugador: Jugador){
        super(scene, 0, 0, 'jugador',0);
        this.color = Phaser.Display.Color.HexStringToColor(jugador.color);        
        this.scene = scene;
        this.jugador = jugador;
        if (this.jugador.CPU)
            this.setFrame(2);        

        scene.add.existing(this);

        scene.physics.world.enableBody(this);
        this.body.immovable = true;
        this.setScale(this.scene.game.scale.width / this.width / 8 , this.scene.game.scale.height / this.height / 8);

        this.setTint(this.color.color);
        this.setX(this.getBounds().width * (this.jugador.numero + 0.5));            
        this.setY(this.getBounds().height / 2);

        this.crearTextosInformacion();

        this.tweenActivo = this.scene.tweens.add({ 
            targets: this,
            alpha: { start: 1, to:0, duration: 1000, ease: 'Power1' },
            paused: true,
            yoyo: true,
            loop: -1
        });
        //this.tweenActivo.stop();
        this.setInteractive();
        this.on('pointerup', this.mostrarOcultarDatos);
    }

    crearTextosInformacion () {
        var estilo = { 
            font: 'bold 10pt Arial',
            fill: COLOR_TEXTO,
            align: 'center'
           }

        this.textos = this.scene.add.group();

        this.nombreText = this.scene.add.text(this.x, this.y - this.getBounds().height / 2, this.jugador.nombre, estilo);
        this.nombreText.setOrigin(0.5, 0);
        this.nombreText.setScrollFactor(0);
        this.nombreText.setStroke(COLOR_STROKE, 1);

        estilo.fill = COLOR_ORO;
        this.oroText = this.scene.add.text(this.x, this.nombreText.y + this.nombreText.height, "Oro: " + this.jugador.oro, estilo);
        this.oroText.setOrigin(0.5, 0);
        this.oroText.setScrollFactor(0);
        this.oroText.setStroke(COLOR_STROKE, 1);
        this.textos.add(this.oroText);

        estilo.fill = COLOR_MADERA;
        this.maderaText = this.scene.add.text(this.x, this.oroText.y + this.oroText.height, "Madera: " + this.jugador.madera, estilo);
        this.maderaText.setOrigin(0.5, 0);
        this.maderaText.setScrollFactor(0);
        this.maderaText.setStroke(COLOR_STROKE, 1);
        this.textos.add(this.maderaText);

        estilo.fill = COLOR_PIEDRA;
        this.piedraText = this.scene.add.text(this.x, this.maderaText.y + this.maderaText.height, "Piedra: " + this.jugador.piedra, estilo);
        this.piedraText.setOrigin(0.5, 0);
        this.piedraText.setScrollFactor(0);
        this.piedraText.setStroke(COLOR_STROKE, 1);
        this.textos.add(this.piedraText);

        estilo.fill = COLOR_TEXTO;
        this.puntosText = this.scene.add.text(this.x, this.piedraText.y + this.piedraText.height, "Puntos: " + this.jugador.puntos, estilo);
        this.puntosText.setOrigin(0.5, 0);
        this.puntosText.setScrollFactor(0);
        this.puntosText.setStroke(COLOR_STROKE, 1);
        this.textos.add(this.puntosText);
    }

    posicionarDelante() {
        this.setDepth(3);
        this.oroText.setDepth(4) ;    
        this.maderaText.setDepth(4) ;    
        this.piedraText.setDepth(4) ; 
        this.puntosText.setDepth(4) ;    

    }

    //#region fichas

    inicializarFichas() {
        this.fichasTerreno = this.scene.physics.add.group();
        for( var i = 0; i < INI_FICHAS.length; i++) {
            var datosficha = INI_FICHAS[i];
            var ficha = new Ficha(
                datosficha.frame,
                datosficha.nombre, 
                datosficha.nivel, 
                datosficha.colocada, 
                datosficha.oculta,
                datosficha.pueblo ? 
                    (i == 0) ? 
                        new Pueblo(this.jugador.color) 
                        : new Pueblo('#FFFFFF') 
                    : null,
                datosficha.minaMadera,
                datosficha.minaPiedra,
                datosficha.minaOro,
                datosficha.minaTecnologia,
                datosficha.tesoro,
                datosficha.bloqueoNorte,
                datosficha.bloqueoSur,
                datosficha.bloqueoEste,
                datosficha.bloqueoOeste

            );
            var fichaTerreno = new FichaSprite(
                this.scene, 
                ficha
                );
            if (datosficha.tropa) {
                for (var j = 0; j < datosficha.tropa.length; j++) {
                    ficha.addTropas(datosficha.tropa[j].jugador, datosficha.tropa[j].tropas)
                }
            }

            if(fichaTerreno.ficha.pueblo)
                fichaTerreno.ficha.pueblo.nombre = datosficha.nombre;

            fichaTerreno.setVisible(false);            
            fichaTerreno.setPosition(50 * i * this.jugador.numero + fichaTerreno.width, 50 * i * this.jugador.numero + fichaTerreno.height);
            this.fichasTerreno.add(fichaTerreno);
            if (i == 0 && ficha.pueblo) {                
                this.jugador.agregarPueblo(ficha.pueblo);
            }
        }
        this.barajarFichas();
        
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    barajarFichas() {
        var fichas = <FichaSprite[]>this.fichasTerreno.getChildren();
        var fichasNiveles = [[]];
        while (fichas.length > 0) {
            var ficha = fichas.splice(0,1)[0];
            if(ficha.ficha.nivel == fichasNiveles.length) {
                fichasNiveles.push(new Array());                
            }
            fichasNiveles[ficha.ficha.nivel].push(ficha);
        }
        for(var i = 1; i < fichasNiveles.length; i++) {
            this.shuffleArray(fichasNiveles[i]);            
        }
        this.fichasTerreno.clear();
        fichasNiveles.forEach(fichas => {
            this.fichasTerreno.addMultiple(fichas);
            // fichas.forEach(ficha => {
            //     this.fichasTerreno.add(ficha);
            // })
        });

    }

    getSiguienteFicha() {
        if (!this.fichasTerreno) return null;
        var fichasArray = this.fichasTerreno.getChildren();

        for (var i = (fichasArray.length-1); i >= 0; i--) 
        {
            var ficha = <FichaSprite>fichasArray[i];
            if (!ficha.ficha.colocada)
                return ficha;
        }

        return null;
    }

    getUltimaFichaColocada() {
        if (!this.fichasTerreno) return null;
        var fichasArray = this.fichasTerreno.getChildren();

        for (var i = 0; i < fichasArray.length; i++) 
        {
            var ficha = <FichaSprite>fichasArray[i];
            if (ficha.ficha.colocada)
                return ficha;
        }

        return null;
    }

    obtenerZonaColocacion() {
        /* var zona = [];
        this.fichasTerreno.getChildren().forEach((ficha: FichaSprite) => {
            if (ficha.ficha.colocada) {
                var x = ficha.x;
                var y = ficha.y;
                var derecha = new Phaser.Math.Vector2(x + ficha.width * ficha.scaleX, y);
                zona.push(derecha);
                var izquierda = new  Phaser.Math.Vector2(x - ficha.width * ficha.scaleX, y);
                zona.push(izquierda);
                var arriba = new Phaser.Math.Vector2(x, y  - ficha.height * ficha.scaleY);
                zona.push(arriba);
                var abajo = new  Phaser.Math.Vector2(x, y  + ficha.height * ficha.scaleY);
                zona.push(abajo);
            }           
        }); */

        return this.jugador.obtenerZonaDeColocacion();
    }

    agregarMina(mina: FichaSprite) {
        this.jugador.agregarMina(mina.ficha);
    }

    quitarMina(mina: FichaSprite) {
        this.jugador.quitarMina(mina.ficha);
    }

    //#endregion fichas

    iniciarTurno() {
        
        this.jugador.iniciarTurno();
        this.refrescarDatos();
        
    }

    activar() {
        this.jugador.activo = true;
        if (this.jugador.CPU)
            this.setFrame(3);
        else
            this.setFrame(1);
        //this.setActive(true);
        this.tweenActivo.restart();
        this.tweenActivo.resume();
        var ficha = this.getUltimaFichaColocada();
        if (ficha) {
            var x = ficha.x;  //- this.scene.cameras.main.width / 2;
            var y = ficha.y; // - this.scene.cameras.main.height / 2;
            if (this.scene.cameras.main.panEffect.isRunning)
                this.scene.cameras.main.panEffect.effectComplete();

            this.scene.cameras.main.pan(x, y);
        }
    }

    desactivar() {
        this.jugador.activo = false;
        
        if (this.jugador.CPU)
            this.setFrame(2);
        else
            this.setFrame(0);
        //this.setActive(false);
        this.tweenActivo.pause();
        this.setAlpha(1);
    }

    refrescarDatos() {
        var incremento: number = 0;

        this.oroText.text = "Oro: " + this.jugador.oro;
        if (this.oroAnterior != this.jugador.oro) {
            incremento = this.jugador.oro - this.oroAnterior;
            if (incremento > 0)
                this.mensajesInformacion.push ({color: COLOR_ORO, mensaje: this.jugador.nombre + ": +" + incremento + " Oro"});
            if (incremento < 0)
                this.mensajesInformacion.push ({color: COLOR_ORO, mensaje: this.jugador.nombre + ": " + incremento + " Oro"});
            this.oroAnterior = this.jugador.oro;
        }

        this.maderaText.text = "Madera: " + this.jugador.madera;
        if (this.maderaAnterior != this.jugador.madera) {
            incremento = this.jugador.madera - this.maderaAnterior;
            if (incremento > 0)
                this.mensajesInformacion.push ({color: COLOR_MADERA, mensaje: this.jugador.nombre + ": +" + incremento + " Madera"});
            if (incremento < 0)
                this.mensajesInformacion.push ({color: COLOR_MADERA, mensaje: this.jugador.nombre + ": " + incremento + " Madera"});
            this.maderaAnterior = this.jugador.madera;
        }

        this.piedraText.text = "Piedra: " + this.jugador.piedra;
        if (this.piedraAnterior != this.jugador.piedra) {
            incremento = this.jugador.piedra - this.piedraAnterior;
            if (incremento > 0)
                this.mensajesInformacion.push ({color: COLOR_PIEDRA, mensaje: this.jugador.nombre + ": +" + incremento + " Piedra"});
            if (incremento < 0)
                this.mensajesInformacion.push ({color: COLOR_PIEDRA, mensaje: this.jugador.nombre + ": " + incremento + " Piedra"});
            this.piedraAnterior = this.jugador.piedra;
        }

        this.puntosText.text = "Puntos: " + this.jugador.puntos;
        if (this.puntosAnterior != this.jugador.puntos) {
            incremento = this.jugador.puntos - this.puntosAnterior;
            if (incremento > 0)
                this.mensajesInformacion.push ({color: COLOR_PUNTOS, mensaje: this.jugador.nombre + ": +" + incremento + " Puntos"});
            if (incremento < 0)
                this.mensajesInformacion.push ({color: COLOR_PUNTOS, mensaje: this.jugador.nombre + ": " + incremento + " Puntos"});
            this.puntosAnterior = this.jugador.puntos;
        }
    }

    mostrarOcultarDatos(pointer, localX, localY, event) {
        
        this.textos.toggleVisible();
        if (event) 
            event.stopPropagation();
        
    }    

}