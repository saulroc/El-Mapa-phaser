import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';
import { JugadorSprite, COLOR_TEXTO, COLOR_STROKE, COLOR_ORO, COLOR_PIEDRA, COLOR_MADERA, COLOR_PUNTOS } from '../Sprites/jugadorSprite';
import { Pueblo } from '../Model/pueblo';
import { FichaSprite } from '../Sprites/fichaSprite';
import { MapSceneService } from './map-scene.service';
import { Tropa } from '../Model/tropa';
import { EdificioSprite } from '../Sprites/edificioSprite';
import { Edificio } from '../Model/edificio';
import { Partida } from '../Model/partida';

const COLOR_ZONA_CONSTRUCCION = 0x00ff00;
const COLOR_ZONA_CONSTRUCCION_SELECCIONADA = 0x0000ff;
const COLOR_EDIFICIO_INACTIVO = 0xA4A4A4;
const COLOR_TROPA_SELECCIONADA = 0xA4A4A4;

@Injectable({
  providedIn: 'root'
})
export class PuebloSceneService extends Phaser.Scene {
    
    background: Phaser.GameObjects.Image;
    pueblo: Pueblo;
    partida: Partida;
    fichaPueblo: FichaSprite;
    edificios: Phaser.GameObjects.Group;
    posicionSeleccionada: number = -1;
    zonasDeConstruccion: Phaser.GameObjects.Group;
    jugador: JugadorSprite;
    textoVolver: Phaser.GameObjects.Text;
    contador: number;
    opcionesComercio : Phaser.GameObjects.Group[];
    textoComercio: Phaser.GameObjects.Text;
    
    grupoInformacion: Phaser.GameObjects.Group;
    textoOro: Phaser.GameObjects.Text;
    textoMadera: Phaser.GameObjects.Text;
    textoPiedra: Phaser.GameObjects.Text;
    textoNivel: Phaser.GameObjects.Text;
    textoInformacion: Phaser.GameObjects.Text;
    textoDescripcion: Phaser.GameObjects.Text;

    public constructor() {
        super({ key: 'Pueblo' });
    }

    public init(ficha: FichaSprite) {
        this.pueblo = ficha.ficha.pueblo;
        this.fichaPueblo = ficha;
        this.posicionSeleccionada = -1;
        this.contador = 0;
        this.opcionesComercio = [];
    }

    public preload() {
        this.load.spritesheet('edificios', 'assets/edificios.png', { frameWidth: 413, frameHeight: 413 });
        this.load.image('fondo', 'assets/Tablero Castillo 3.png');

    }

    public create() {
        this.background = this.add.image(0, 0, 'fondo');
        this.background.setOrigin(0, 0);

        var scale = this.fichaPueblo.getEscala();
        var mapa =<MapSceneService>this.game.scene.getScene('Map');
        this.partida = mapa.partida;
        this.jugador =mapa.jugadorActivo;

        //var escalaX = this.cameras.main.width / this.background.width;
        //var escalaY = this.cameras.main.height / this.background.height;
        this.background.setScale(scale);
        
        this.edificios = this.add.group();
        this.zonasDeConstruccion = this.add.group();;
        this.grupoInformacion = this.add.group();

        var estilo = { 
            font: 'bold 16pt Arial',
            fill: COLOR_TEXTO,
            align: 'center',
            wordWrap: true
           }

        var x = 3.5 * this.fichaPueblo.width * this.fichaPueblo.scaleX;
        var y = (this.fichaPueblo.height * this.fichaPueblo.scaleY + 5) + (this.fichaPueblo.height * this.fichaPueblo.scaleY) / 2;
           
        this.textoVolver = this.add.text(x, y, 'Cerrar', estilo);
        this.textoVolver.setInteractive();
        this.textoVolver.on('pointerup', this.cerrar, this);
        this.textoVolver.setOrigin(0.5);
        this.textoVolver.setStroke(COLOR_STROKE, 1);
        
        this.crearInformacion()
        

        this.pintarComercio();

        if(this.pueblo && this.pueblo.edificios)
            this.cargarEdificios(this.pueblo.edificios);

        if (this.jugador.jugador.esPropietario(this.pueblo) ) {
            this.pintarLevas();
            if (!this.pueblo.construido)
                this.cargarZonasConstruccion();
            
        }

        //this.input.on('pointerup', this.seleccionadoParaConstruir, this);
    }   
    
    ocultarInformacion() {
        this.grupoInformacion.setVisible(false);
    }

    crearInformacion() {
        var estilo = { 
            font: 'bold 16pt Arial',
            fill: COLOR_TEXTO,
            align: 'center',
            wordWrap: true,
            wordWrapWidth: this.cameras.main.width / 4
           }

        this.textoInformacion = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "", estilo);
        this.textoInformacion.setInteractive();
        this.textoInformacion.on('pointerup', this.ocultarInformacion, this);
        this.textoInformacion.setOrigin(0.5);
        this.textoInformacion.setDepth(2);
        this.textoInformacion.setStroke(COLOR_STROKE, 2);
        this.grupoInformacion.add(this.textoInformacion);

        estilo.fill = COLOR_PUNTOS;
        this.textoNivel = this.add.text(this.cameras.main.centerX, this.textoInformacion.y + this.textoInformacion.height, "", estilo);        
        this.textoNivel.setInteractive();
        this.textoNivel.on('pointerup', this.ocultarInformacion, this);
        this.textoNivel.setOrigin(0.5);
        this.textoNivel.setDepth(2);
        this.textoNivel.setStroke(COLOR_STROKE, 2);
        this.grupoInformacion.add(this.textoNivel);

        estilo.fill = COLOR_ORO;
        this.textoOro = this.add.text(this.cameras.main.centerX, this.textoNivel.y + this.textoNivel.height, "", estilo);        
        this.textoOro.setInteractive();
        this.textoOro.on('pointerup', this.ocultarInformacion, this);
        this.textoOro.setOrigin(0.5);
        this.textoOro.setDepth(2);
        this.textoOro.setStroke(COLOR_STROKE, 2);
        this.grupoInformacion.add(this.textoOro);

        estilo.fill = COLOR_MADERA;
        this.textoMadera = this.add.text(this.cameras.main.centerX,this.textoOro.y + this.textoOro.height, "", estilo);        
        this.textoMadera.setInteractive();
        this.textoMadera.on('pointerup', this.ocultarInformacion, this);
        this.textoMadera.setOrigin(0.5);
        this.textoMadera.setDepth(2);
        this.textoMadera.setStroke(COLOR_STROKE, 2);
        this.grupoInformacion.add(this.textoMadera);

        estilo.fill = COLOR_PIEDRA;
        this.textoPiedra = this.add.text(this.cameras.main.centerX,this.textoMadera.y + this.textoMadera.height, "", estilo);        
        this.textoPiedra.setInteractive();
        this.textoPiedra.on('pointerup', this.ocultarInformacion, this);
        this.textoPiedra.setOrigin(0.5);
        this.textoPiedra.setDepth(2);
        this.textoPiedra.setStroke(COLOR_STROKE, 2);
        this.grupoInformacion.add(this.textoPiedra);

        estilo.fill = COLOR_TEXTO;
        this.textoDescripcion = this.add.text(this.cameras.main.centerX,this.textoPiedra.y + this.textoPiedra.height, "", estilo);        
        this.textoDescripcion.setInteractive();
        this.textoDescripcion.on('pointerup', this.ocultarInformacion, this);
        this.textoDescripcion.setOrigin(0.5);
        this.textoDescripcion.setDepth(2);
        this.textoDescripcion.width = this.cameras.main.width;
        this.textoDescripcion.setStroke(COLOR_STROKE, 2);
        this.grupoInformacion.add(this.textoDescripcion);
    }

    //#region Edificios

    cargarZonasConstruccion() {
        
        var ancho = this.fichaPueblo.width * this.fichaPueblo.getEscala();
        
        for(var i = 0; i < 10; i++) {
            var zonaConstruccion = this.add.rectangle(10 , 10, ancho, ancho, COLOR_ZONA_CONSTRUCCION, 0.5);
            this.posicionar(zonaConstruccion, i, -1); 
            if(this.pueblo.cumpleRequisitoNivel(i)) {
                zonaConstruccion.setInteractive();
                zonaConstruccion.setStrokeStyle(4, 0xefc53f);
                zonaConstruccion.on('pointerup', this.seleccionarParaConstruir);
                zonaConstruccion.setFillStyle(COLOR_ZONA_CONSTRUCCION_SELECCIONADA, 1);
            }
            if (this.pueblo.hayEdificioEnLaPosicion(i))
                zonaConstruccion.setVisible(false);
            this.zonasDeConstruccion.add(zonaConstruccion);
        }
    }    

    seleccionarParaConstruir() {
        var escenaPueblo = <PuebloSceneService><unknown>this.scene;
        escenaPueblo.seleccionadoParaConstruir(this);
    }

    seleccionadoParaConstruir(zonaConstruccion) {
        
        if (this.pueblo.construido) return;
        
        var indice = this.zonasDeConstruccion.getChildren().indexOf(zonaConstruccion);
        this.posicionSeleccionada = indice;

        this.zonasDeConstruccion.getChildren().forEach((zona: Phaser.GameObjects.Rectangle) => {
            zona.setFillStyle(COLOR_ZONA_CONSTRUCCION, 0.5);            
        });

        var zona = <Phaser.GameObjects.Rectangle>this.zonasDeConstruccion.getChildren()[indice];
        zona.setFillStyle(COLOR_ZONA_CONSTRUCCION_SELECCIONADA, 0.5);

        this.edificios.getChildren().forEach((edificioSprite: EdificioSprite) => {
            if (!edificioSprite.edificio.estaConstruido())
            {
                edificioSprite.clearTint();                
                if (edificioSprite.edificio.sePuedeConstruir(this.jugador.jugador.oro, this.jugador.jugador.madera, this.jugador.jugador.piedra, indice)) {
                    // edificioSprite.setInteractive();                    

                } else {
                    edificioSprite.tint = COLOR_EDIFICIO_INACTIVO;
                    // edificioSprite.removeInteractive();
                }
            }
        });
    }

    cargarEdificios(edificios){
        for (var i = 0; i < edificios.length; i ++) {
            
            var edificioSprite = new EdificioSprite(this, edificios[i] );            
            this.posicionar(edificioSprite, edificioSprite.edificio.posicion, edificioSprite.edificio.numeroFrame);

            if(edificioSprite.edificio.estaConstruido() && this.jugador.jugador.esPropietario(this.pueblo))
                edificioSprite.pintarTropas();
            
            this.edificios.add(edificioSprite);
        }
    }

    mostrarInformacion(edificioSprite: EdificioSprite) {
        var edificio = edificioSprite.edificio;
        this.textoInformacion.text = edificio.nombre.charAt(0).toUpperCase() + edificio.nombre.slice(1) + " coste: ";
        this.textoNivel.text = "nivel " + edificio.nivel;
        this.textoOro.text = edificio.oro + " Oro";
        this.textoMadera.text = edificio.madera + " Madera";
        this.textoPiedra.text = edificio.piedra + " Piedra";
        this.textoDescripcion.text = edificio.descripcion;
        this.grupoInformacion.setVisible(true);
    }

    construirEdificio(edificioSprite: EdificioSprite) {
        if ( !this.jugador.jugador.puedeComprar(edificioSprite.edificio.oro, edificioSprite.edificio.madera, edificioSprite.edificio.piedra)) {
            this.mostrarInformacion(edificioSprite);
            return;
        }

        edificioSprite.edificio.posicion = this.posicionSeleccionada;
        this.posicionar(edificioSprite, edificioSprite.edificio.posicion, edificioSprite.edificio.numeroFrame);        
        edificioSprite.setDepth(1);
        edificioSprite.pintarTropas();
        this.zonasDeConstruccion.setVisible(false);

        this.edificios.getChildren().forEach((edificio: EdificioSprite) => edificio.clearTint() );            
        this.pueblo.construirEdificio(this.posicionSeleccionada, edificioSprite.edificio.nombre);
        var jugador = this.jugador.jugador;
        jugador.setOro(edificioSprite.edificio.oro * -1);
        jugador.setMadera(edificioSprite.edificio.madera * -1);
        jugador.setPiedra(edificioSprite.edificio.piedra * -1);
        jugador.setPuntos(edificioSprite.edificio.puntos);
        jugador.refrescarMaximoPelotonesMoviendo();
        this.jugador.refrescarDatos();
        this.posicionSeleccionada = -1;
        if (edificioSprite.edificio.nivel == 4)
            this.partida.maravillaConstruida(edificioSprite.edificio);
        
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
                y = (objeto.height * objeto.scaleY  + 5) * 3 + (objeto.height * objeto.scaleY) / 2;
                break;

            case 4:
            case 5:
            case 6:
                x = (posicion - 3) * objeto.width * objeto.scaleX;
                y = (objeto.height * objeto.scaleY + 5) * 2 + (objeto.height * objeto.scaleY) / 2;
                break;
            case 7:
            case 8:
                x = (posicion - 5.5) * objeto.width * objeto.scaleX;
                y = (objeto.height * objeto.scaleY + 5) + (objeto.height * objeto.scaleY) / 2;
                break;
            case 9:
                x = (posicion - 7) * objeto.width * objeto.scaleX;
                y = (objeto.height * objeto.scaleY) / 2;
                break;
            default:
                x = this.scale.width - objeto.width * objeto.scaleX;
                y = frame * objeto.height * objeto.scaleY;
                break;
        }

        objeto.setPosition(x, y);
    }

    //#endregion Edificios

    //#region Tropas

    pintarLevas() {
        
        var escala = this.fichaPueblo.getEscala();
        for(var i = 0; i < this.pueblo.leva.cantidad; i++) {
            var x = (1.25 - Math.random() * 0.5) * this.fichaPueblo.width * this.fichaPueblo.scaleX;
            var y = (0.75 - Math.random() * 0.5) * (this.fichaPueblo.height * this.fichaPueblo.scaleY);
            var leva = this.add.sprite(x, y, 'marcadores', 2);
            leva.setData('tropa', this.pueblo.leva);
            leva.setScale(escala / 2);
            leva.setInteractive();
            leva.on('pointerup', this.seleccionarTropaParaComprar);                        
        }
    }

    seleccionarTropaParaComprar() {
        var tropaSprite = <Phaser.GameObjects.Sprite><unknown>this;
        var escenaPueblo = <PuebloSceneService><unknown>this.scene;
        var tropa = <Tropa>tropaSprite.getData('tropa');
        if (tropaSprite.isTinted) {
            if (escenaPueblo.jugador.jugador.puedeComprar(tropa.coste.oro, tropa.coste.madera, tropa.coste.piedra))
                escenaPueblo.comprarTropa(tropaSprite);
            else
                tropaSprite.clearTint();
        } else {
            escenaPueblo.mostrarInformacionTropa(tropa);
            if (escenaPueblo.jugador.jugador.puedeComprar(tropa.coste.oro, tropa.coste.madera, tropa.coste.piedra))
                tropaSprite.tint = COLOR_TROPA_SELECCIONADA;
        }
    }

    mostrarInformacionTropa(tropa: Tropa) {
        this.textoInformacion.text = tropa.tipo.charAt(0).toUpperCase() + tropa.tipo.slice(1) + " - cantidad: " + Math.floor(tropa.cantidad) + ", coste: ";
        this.textoNivel.text = "nivel " + tropa.nivel;
        this.textoOro.text = tropa.coste.oro + " Oro";
        this.textoMadera.text = tropa.coste.madera + " Madera";
        this.textoPiedra.text = tropa.coste.piedra + " Piedra";
        this.textoDescripcion.text = "Vida " + tropa.vida 
            + ", Daño " + tropa.ataque 
            + ", Distancia de ataque " + tropa.distanciaDeAtaque
            + ", Velocidad " + tropa.velocidad
            + ", Movimiento " + tropa.movimiento;
        this.grupoInformacion.setVisible(true);
    }

    comprarTropa(tropaSprite: Phaser.GameObjects.Sprite) {
        tropaSprite.setVisible(false);
        var tropa = <Tropa>tropaSprite.getData('tropa');
        this.jugador.jugador.setOro(-1 * tropa.coste.oro);
        this.jugador.jugador.setMadera(-1 * tropa.coste.madera);
        this.jugador.jugador.setPiedra(-1 * tropa.coste.piedra);

        var nuevaTropa = Object.assign({}, tropa);
        nuevaTropa.cantidad = 1;
        this.fichaPueblo.ficha.addTropa(this.jugador.jugador, nuevaTropa);
        this.fichaPueblo.cargarMarcadoresTropas();
        this.jugador.refrescarDatos();
        tropa.cantidad -= 1;
        tropaSprite.destroy();

    }
    //#endregion Tropas

    //#region Comercio
    pintarComercio() {
        var estilo = { 
            font: 'bold 16pt Arial',
            fill: '#ffffff',
            align: 'center',
            wordWrap: true
           }

        var x = 0.5 * this.fichaPueblo.width * this.fichaPueblo.scaleX;
        var y = 1.5 * (this.fichaPueblo.height * this.fichaPueblo.scaleY + 5);
        
        this.crearOpcionesComercio();
           
        this.textoComercio = this.add.text(x, y, 'Comercio', estilo);
        this.textoComercio.setOrigin(0.5);
        this.textoComercio.setInteractive();
        this.textoComercio.on('pointerup', this.mostrarOcultarComercio, this);
        this.textoComercio.setStroke(COLOR_STROKE, 2);

    }

    crearOpcionesComercio() {
        this.pueblo.opcionesComercio.forEach((value, index) => {
            this.crearOpcionComercio(index, value[0], value[1]);
        });
        this.opcionesComercio.forEach(grupo => {
            grupo.toggleVisible();
        })
    }

    mostrarOcultarComercio() {
        if (this.pueblo.puedeComerciar() && this.jugador.jugador.esPropietario(this.pueblo)) {
            this.opcionesComercio.forEach(grupo => {
                grupo.toggleVisible();
            })
        }        
    }

    crearOpcionComercio(indice: number, dar: {oro: number, madera: number, piedra: number}, recibir: {oro: number, madera: number, piedra: number}) {
        var grupoOpcion: Phaser.GameObjects.Group;

        if (this.opcionesComercio.length - 1 < indice) {
            grupoOpcion = this.add.group();  
            if (dar.oro > 0) {
                this.pintarIconos(grupoOpcion, 7, dar.oro);
            } 
            if (dar.madera > 0) {
                this.pintarIconos(grupoOpcion, 8, dar.madera);
            }
            if (dar.piedra > 0) {
                this.pintarIconos(grupoOpcion, 9, dar.piedra);
            }
            this.pintarIconos(grupoOpcion, 6, 1);
            if (recibir.oro > 0) {
                this.pintarIconos(grupoOpcion, 7, recibir.oro);
            } 
            if (recibir.madera > 0) {
                this.pintarIconos(grupoOpcion, 8, recibir.madera);
            }
            if (recibir.piedra > 0) {
                this.pintarIconos(grupoOpcion, 9, recibir.piedra);
            }
            var sprite = (<Phaser.GameObjects.Sprite>grupoOpcion.getChildren()[0])
            var y = sprite.height * sprite.scaleY;
            grupoOpcion.setY((indice + 0.5) * y);
            grupoOpcion.getChildren().forEach(sprite => {
                sprite.setData("comercio", [dar, recibir]);
                sprite.on("pointerup", this.seleccionarComercio);
            });   
            this.opcionesComercio.push(grupoOpcion);
       
        }        

    }

    pintarIconos(grupo: Phaser.GameObjects.Group, numeroFrame: number, cantidad: number) {
        for(var i =0; i < cantidad; i++) {
            var spriteIcono = this.add.sprite(100, 100, 'marcadores', numeroFrame);
            spriteIcono.setScale(this.fichaPueblo.getEscala() / 2);
            spriteIcono.setInteractive();
            spriteIcono.setDepth(2);
            grupo.add(spriteIcono);
            spriteIcono.setX(spriteIcono.x + (grupo.getChildren().length * spriteIcono.width * spriteIcono.scaleX));
        }
    }

    seleccionarComercio() {
        var comercioSprite = <Phaser.GameObjects.Sprite><unknown>this;
        var escenaPueblo = <PuebloSceneService><unknown>this.scene;
        var comercio = comercioSprite.getData('comercio');
        if (comercioSprite.isTinted) {
            if (escenaPueblo.jugador.jugador.puedeComprar(comercio[0].oro,comercio[0].madera, comercio[0].piedra))
                escenaPueblo.comerciar(comercioSprite);
            else
                comercioSprite.clearTint();
        } else {
            if (escenaPueblo.jugador.jugador.puedeComprar(comercio[0].oro,comercio[0].madera, comercio[0].piedra)) {
                comercioSprite.tint = COLOR_TROPA_SELECCIONADA;
                escenaPueblo.opcionesComercio.forEach(opcion => {
                    if (opcion.getChildren().includes(comercioSprite)) {
                        opcion.setTint(COLOR_TROPA_SELECCIONADA);
                    } else {
                        opcion.getChildren().forEach((sprite: Phaser.GameObjects.Sprite) => {
                            sprite.clearTint()
                        });
                    }
                })
            }
        }
    }

    comerciar(spriteComercio: Phaser.GameObjects.Sprite) {

        var comercio = spriteComercio.getData('comercio');
        this.jugador.jugador.setOro(-1 * comercio[0].oro);
        this.jugador.jugador.setMadera(-1 * comercio[0].madera);
        this.jugador.jugador.setPiedra(-1 * comercio[0].piedra);
        this.jugador.jugador.setOro(comercio[1].oro);
        this.jugador.jugador.setMadera(comercio[1].madera);
        this.jugador.jugador.setPiedra(comercio[1].piedra);
        this.jugador.refrescarDatos();
        this.pueblo.comerciar();

        this.opcionesComercio.forEach(opcion => {
            opcion.setVisible(false);
            opcion.getChildren().forEach((sprite: Phaser.GameObjects.Sprite) => {
                sprite.clearTint()
            });
        });
    }
    //#endregion Comercio

    cerrar(pointer, localX, localY, event) {
        this.scene.resume('Map');
        this.scene.stop();
        if (event) 
            event.stopPropagation();
    }

    public update() {
        if (!this.jugador.jugador.esPropietario(this.pueblo) || this.pueblo.construido) {
            if(this.contador < 10) {
                this.contador++;
            } else {
                this.contador = 0;
                if (this.textoVolver.style.strokeThickness == 1)    
                    this.textoVolver.setStroke(COLOR_STROKE, 3);
                else
                    this.textoVolver.setStroke(COLOR_STROKE, 1);  
            }
              
        }
    }
}