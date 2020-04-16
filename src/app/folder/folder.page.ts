import { Component, OnInit } from '@angular/core';
import { environment } from '../../../src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MapSceneService } from '../services/map-scene.service';

import * as Phaser from 'phaser';

const SCENES = {
  FIRST: 'FirstScene',
  SECOND: 'SecondScene'
}

class CommonScene extends Phaser.Scene {
  helloWorld: Phaser.GameObjects.Text

  init () {
    this.cameras.main.setBackgroundColor('#24252A');
  }

  create () {
    this.helloWorld = this.add.text(
      this.cameras.main.centerX, 
      this.cameras.main.centerY, 
      "Hello World", { 
        font: "40px Arial", 
        fill: "#ffffff" 
      }
    );
    this.helloWorld.setOrigin(0.5);

    this.input.keyboard.on('keyup_C', function() {
      this.scene.start(
        this.scene.key === SCENES.FIRST ?
          SCENES.SECOND : SCENES.FIRST
      );
    }, this);
  }

  setAngle (angle: number) {
    this.helloWorld.angle = angle;
  }
}

class FirstScene extends CommonScene {
  update () {
    this.helloWorld.angle += 1;
  }
}

class SecondScene extends CommonScene {
  update () {
    this.helloWorld.angle -= 1;
  }
}

class BootScene extends Phaser.Scene {
  create() {
    this.scene.add(SCENES.FIRST, FirstScene, true);
    this.scene.add(SCENES.SECOND, SecondScene, false);

    this.scene.run(SCENES.FIRST);
  }
}

interface GameInstance extends Phaser.Types.Core.GameConfig {
  instance: Phaser.Game
}

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  providers: [MapSceneService]
})
export class FolderPage implements OnInit {
  public folder: string;
  public initialize: boolean = false;

  game: GameInstance = {
    title: environment.title,
    version: environment.version,
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 45,
    physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
    },
    scene: [MapSceneService],
    instance: null
  }

  constructor(private activatedRoute: ActivatedRoute,
    private mapSceneService: MapSceneService) { }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }

  initializeGame() {    
    this.initialize = true

  }

  getInstance(){
    return this.game.instance;
  }

  changeAngle () {
    const instance = this.getInstance();
    instance.scene.scenes.forEach(scene => {
      if (scene.sys.isActive() && scene instanceof CommonScene) {
        scene.setAngle(0);
      }
    });
  }

}
